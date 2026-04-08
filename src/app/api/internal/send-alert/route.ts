import { NextRequest, NextResponse } from 'next/server';
import { pushAlertDocument } from '@/lib/crm/firestore-rest';

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

    const alertId = await pushAlertDocument({ type, priority: priority || 'medium', message, leadId, dealId, metadata });
    return NextResponse.json({ success: true, alertId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
