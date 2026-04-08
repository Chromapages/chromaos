import { NextRequest, NextResponse } from 'next/server';
import { db, Timestamp } from '@/lib/firebase-admin';
import { getLeadContext } from '@/lib/crm/getLeadContext';
import { saveAgentRun } from '@/lib/crm/saveAgentRun';
import { logActivity } from '@/lib/crm/logActivity';

export async function POST(request: NextRequest) {
  // Validate API key
  const apiKey = request.headers.get('x-api-key');
  if (apiKey !== process.env.OPENCLAW_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { leadId } = body;
    if (!leadId) {
      return NextResponse.json({ error: 'leadId is required' }, { status: 400 });
    }

    // Gather CRM context
    const context = await getLeadContext(leadId);
    const { lead } = context;

    // Build classification prompt for Chroma
    const prompt = `You are the Chromapages orchestration agent. Classify this lead based on the context provided.

Lead data:
- Name: ${lead.fullName || 'N/A'}
- Company: ${lead.companyName || 'N/A'}
- Trade/Vertical: ${lead.tradeOrVertical || 'N/A'}
- Source: ${lead.source || 'N/A'} ${lead.sourceDetail ? `(${lead.sourceDetail})` : ''}
- Budget Range: ${lead.budgetRange || 'N/A'}
- Timeline: ${lead.timeline || 'N/A'}
- Offer Interest: ${lead.offerInterest || 'N/A'}
- Website: ${lead.website || 'N/A'}
- Status: ${lead.status || 'N/A'}
- Fit Score (existing): ${lead.fitScore || 'N/A'}

Return a JSON object with exactly these fields:
{
  "fitScore": number (1-10),
  "disposition": "proceed" | "proceed_with_caution" | "redirect" | "disqualify",
  "packageFit": "audit_only" | "starter" | "growth" | "full_rebuild",
  "nextAction": string (specific next step recommendation),
  "summary": string (2-3 sentence buyer-facing summary of this lead),
  "riskFlags": string[] (array of risk factors),
  "urgencyLevel": "high" | "medium" | "low"
}`;

    // Call OpenClaw via sessions_send
    const openclawRes = await fetch('http://127.0.0.1:18789/api/sessions/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionKey: 'agent:chroma:main',
        message: prompt,
        timeoutSeconds: 120,
      }),
    });

    let agentOutput: Record<string, any> = {};
    if (openclawRes.ok) {
      const data = await openclawRes.json();
      // Try to parse the response as JSON
      try {
        agentOutput = typeof data.reply === 'string' ? JSON.parse(data.reply) : data.reply || {};
      } catch {
        agentOutput = { raw: data.reply || 'No output', summary: data.reply?.slice(0, 200) || 'No output' };
      }
    } else {
      agentOutput = { error: 'OpenClaw call failed', status: openclawRes.status };
    }

    // Save to agentRuns
    const runId = await saveAgentRun({
      leadId,
      companyId: lead.companyId || undefined,
      agentName: 'Chroma',
      action: 'lead_classify',
      output: agentOutput,
      metadata: { leadStatus: lead.status, source: lead.source },
    });

    // 5. Update the Lead document with classification results
    if (agentOutput && !agentOutput.error) {
      await db.collection('leads').doc(leadId).update({
        disposition: agentOutput.disposition || 'proceed',
        packageFit: agentOutput.packageFit || 'starter',
        fitScore: agentOutput.fitScore || 5,
        urgencyLevel: agentOutput.urgencyLevel || 'medium',
        nextAction: agentOutput.nextAction || 'Follow up required',
        agentSummary: agentOutput.summary || '',
        riskFlags: agentOutput.riskFlags || [],
        classificationAgent: 'Chroma',
        classificationConfidence: agentOutput.confidence || 0.85,
        classifiedAt: Timestamp.now(),
      });
    }

    // Log to activities
    const summaryText = agentOutput.summary || `Lead classified as ${agentOutput.disposition} (fit: ${agentOutput.fitScore}/10)`;
    await logActivity({
      recordId: leadId,
      recordType: 'lead',
      activityType: 'ai_classification',
      summary: summaryText,
      agentName: 'Chroma',
      metadata: { fitScore: agentOutput.fitScore, disposition: agentOutput.disposition, runId },
    });

    return NextResponse.json({ success: true, runId, output: agentOutput });
  } catch (error: any) {
    console.error('lead-classify error:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
