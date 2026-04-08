import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const API_KEY = 'acb66b54c1b0db79aabc64a9c8e5c9652763a62efea7c246ca96d006b0e28344';

export async function POST(request: NextRequest) {
  if (request.headers.get('x-api-key') !== API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, priority, message, leadId, dealId, metadata } = body;

    if (!message || !type) {
      return NextResponse.json({ error: 'message and type required' }, { status: 400 });
    }

    const docData: Record<string, any> = {
      type,
      priority: priority || 'medium',
      message,
      createdAt: Timestamp.now(),
      acknowledged: false,
    };
    if (leadId) docData.leadId = leadId;
    if (dealId) docData.dealId = dealId;
    if (metadata) docData.metadata = metadata;

    const docRef = await addDoc(collection(db, 'agents/chroma/alerts'), docData);
    return NextResponse.json({ success: true, alertId: docRef.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
