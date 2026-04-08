import { NextRequest, NextResponse } from 'next/server';
import { writeLeadClassificationFields } from '@/lib/crm/firestore-rest';

const API_KEY = 'acb66b54c1b0db79aabc64a9c8e5c9652763a62efea7c246ca96d006b0e28344';

export async function POST(request: NextRequest) {
  if (request.headers.get('x-api-key') !== API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { leadId, disposition, nextAction, followUpDate, classificationConfidence, urgencyLevel, packageFit, riskFlags, agentSummary } = body;

    if (!leadId || !disposition) {
      return NextResponse.json({ error: 'leadId and disposition required' }, { status: 400 });
    }

    const data: Record<string, any> = {
      disposition,
      classifiedAt: new Date().toISOString(),
      classificationAgent: 'chroma',
    };
    if (nextAction) data.nextAction = nextAction;
    if (followUpDate) data.followUpDate = followUpDate instanceof Date ? followUpDate.toISOString() : followUpDate;
    if (classificationConfidence !== undefined) data.classificationConfidence = classificationConfidence;
    if (urgencyLevel) data.urgencyLevel = urgencyLevel;
    if (packageFit) data.packageFit = packageFit;
    if (riskFlags) data.riskFlags = riskFlags;
    if (agentSummary) data.agentSummary = agentSummary;

    await writeLeadClassificationFields(leadId, data);
    return NextResponse.json({ success: true, leadId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
