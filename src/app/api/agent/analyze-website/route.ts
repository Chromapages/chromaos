import { NextRequest, NextResponse } from 'next/server';
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
    const { leadId, companyId } = body;
    if (!leadId) {
      return NextResponse.json({ error: 'leadId is required' }, { status: 400 });
    }

    // Gather CRM context
    const context = await getLeadContext(leadId);
    const { lead, company } = context;
    const websiteUrl = company?.website || lead.website;

    if (!websiteUrl) {
      return NextResponse.json({ error: 'No website URL found for this lead/company' }, { status: 400 });
    }

    // Build website analysis prompt for Chroma/Prism
    const prompt = `You are the Chromapages research agent. Analyze this contractor's website and deliver a structured audit.

Website URL: ${websiteUrl}
Company: ${company?.name || lead.companyName || 'N/A'}
Trade: ${lead.tradeOrVertical || 'N/A'}
Service Area: ${lead.companyName ? 'Infer from company' : 'N/A'}

Analyze the website across these 5 categories and return a JSON object:

{
  "websiteUrl": "${websiteUrl}",
  "categoryScores": {
    "offerClarity": { "score": number (1-10), "trend": "up" | "down" | "flat", "summary": string },
    "conversionPath": { "score": number (1-10), "trend": "up" | "down" | "flat", "summary": string },
    "trustSignals": { "score": number (1-10), "trend": "up" | "down" | "flat", "summary": string },
    "localVisibility": { "score": number (1-10), "trend": "up" | "down" | "flat", "summary": string },
    "siteQuality": { "score": number (1-10), "trend": "up" | "down" | "flat", "summary": string }
  },
  "overallScore": number (1-10),
  "top3Issues": [
    { "category": string, "issue": string, "severity": "high" | "medium" | "low", "whyItMatters": string }
  ],
  "top3Opportunities": [
    { "opportunity": string, "whyItMatters": string }
  ],
  "executiveDiagnosis": string (3-5 sentences on the single most important thing to fix and what changes if fixed),
  "confidenceLevel": "high" | "medium" | "low",
  "recommendedPath": "audit_only" | "conversion_sprint" | "landing_page" | "website_refresh" | "full_rebuild" | "local_seo"
}`;

    // Call OpenClaw via sessions_send
    const openclawRes = await fetch('http://127.0.0.1:18789/api/sessions/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionKey: 'agent:chroma:main',
        message: prompt,
        timeoutSeconds: 180,
      }),
    });

    let agentOutput: Record<string, any> = {};
    if (openclawRes.ok) {
      const data = await openclawRes.json();
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
      companyId: companyId || lead.companyId || undefined,
      agentName: 'Prism',
      action: 'website_analysis',
      output: agentOutput,
      metadata: { websiteUrl, companyName: company?.name },
    });

    // Log to activities
    const summaryText = agentOutput.executiveDiagnosis
      ? agentOutput.executiveDiagnosis.slice(0, 150)
      : `Website analysis complete — overall score: ${agentOutput.overallScore || 'N/A'}/10`;
    await logActivity({
      recordId: leadId,
      recordType: 'lead',
      activityType: 'ai_website_analysis',
      summary: summaryText,
      agentName: 'Prism',
      metadata: { websiteUrl, overallScore: agentOutput.overallScore, runId },
    });

    return NextResponse.json({ success: true, runId, output: agentOutput });
  } catch (error: any) {
    console.error('analyze-website error:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
