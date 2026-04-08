import { NextRequest, NextResponse } from 'next/server';
import { writeLeadClassification } from '@/lib/crm/writeLeadClassification';
import { createLeadTask } from '@/lib/crm/createLeadTask';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, disposition, nextAction, followUpDate, classificationConfidence, urgencyLevel, packageFit, riskFlags, agentSummary } = body;

    if (!leadId || !disposition) {
      return NextResponse.json({ error: 'leadId and disposition required' }, { status: 400 });
    }

    // Write classification to lead record
    await writeLeadClassification({
      leadId,
      disposition,
      nextAction: nextAction || undefined,
      followUpDate: followUpDate ? new Date(followUpDate) : undefined,
      classificationConfidence: classificationConfidence || undefined,
      urgencyLevel: urgencyLevel || undefined,
      packageFit: packageFit || undefined,
      riskFlags: riskFlags || undefined,
      agentSummary: agentSummary || undefined,
      classificationAgent: 'chroma',
    });

    // If urgency is high/urgent, create a follow-up task
    let taskId = null;
    if (urgencyLevel === 'high' || urgencyLevel === 'urgent') {
      const dueDate = followUpDate ? new Date(followUpDate) : new Date(Date.now() + 24 * 60 * 60 * 1000);
      taskId = await createLeadTask({
        leadId,
        title: `Follow up: ${disposition} — ${nextAction || 'no action specified'}`,
        description: agentSummary || null,
        dueDate,
        priority: urgencyLevel === 'urgent' ? 'high' : 'medium',
      });
    }

    return NextResponse.json({ success: true, leadId, taskId });
  } catch (error: any) {
    console.error('lead-classify-write error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}