import { NextRequest, NextResponse } from 'next/server';
import { writeLeadClassification } from '@/lib/crm/writeLeadClassification';

const API_KEY = 'acb66b54c1b0db79aabc64a9c8e5c9652763a62efea7c246ca96d006b0e28344';

function authenticate(request: NextRequest) {
  return request.headers.get('x-api-key') === API_KEY;
}

export async function POST(request: NextRequest) {
  if (!authenticate(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const { leadId, disposition, nextAction, followUpDate, classificationConfidence, urgencyLevel, packageFit, riskFlags, agentSummary } = body;
    
    if (!leadId || !disposition) {
      return NextResponse.json({ error: 'leadId and disposition required' }, { status: 400 });
    }
    
    await writeLeadClassification({
      leadId,
      disposition,
      nextAction,
      followUpDate: followUpDate ? new Date(followUpDate) : undefined,
      classificationConfidence,
      urgencyLevel,
      packageFit,
      riskFlags,
      agentSummary,
      classificationAgent: 'chroma',
    });
    
    return NextResponse.json({ success: true, leadId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
