import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

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

    const updates: Record<string, any> = {
      disposition,
      classifiedAt: new Date().toISOString(),
      classificationAgent: 'chroma',
    };
    if (nextAction) updates.nextAction = nextAction;
    if (followUpDate) updates.followUpDate = followUpDate;
    if (classificationConfidence !== undefined) updates.classificationConfidence = classificationConfidence;
    if (urgencyLevel) updates.urgencyLevel = urgencyLevel;
    if (packageFit) updates.packageFit = packageFit;
    if (riskFlags) updates.riskFlags = riskFlags;
    if (agentSummary) updates.agentSummary = agentSummary;

    await updateDoc(doc(db, 'leads', leadId), updates);
    return NextResponse.json({ success: true, leadId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
