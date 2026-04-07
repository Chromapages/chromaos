import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

// GET /api/leads/[leadId] — fetch a single lead by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const { leadId } = await params;
    if (!leadId) {
      return NextResponse.json({ error: 'leadId is required' }, { status: 400 });
    }

    const leadSnap = await getDoc(doc(db, 'leads', leadId));
    if (!leadSnap.exists()) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, lead: { id: leadSnap.id, ...leadSnap.data() } });
  } catch (error: any) {
    console.error('GET /api/leads/[leadId] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
