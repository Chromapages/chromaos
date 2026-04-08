import { NextRequest, NextResponse } from 'next/server';
import { db, Timestamp } from '@/lib/firebase-admin';
import { notifyDiscordOfLead } from '@/lib/crm/notifyDiscord';
import { getOrCreateCompany } from '@/lib/crm/company-helper';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, companyName, website, tradeOrVertical, source } = body;

    if (!fullName && !companyName) {
      return NextResponse.json({ error: 'fullName or companyName is required' }, { status: 400 });
    }

    // Lead-to-Company Matching Bridge
    const companyId = await getOrCreateCompany({
      name: companyName || fullName || 'Unknown',
      website: website || '',
      brandId: body.brandId || 'ChromaPages',
      industry: tradeOrVertical || 'Unknown'
    });

    const leadData = {
      fullName: fullName || companyName || 'Unknown',
      companyName: companyName || fullName || 'Unknown',
      email: body.email || null,
      phone: body.phone || null,
      website: body.website || null,
      tradeOrVertical: tradeOrVertical || body.trade || null,
      source: source || body.leadSource || 'direct',
      sourceDetail: body.sourceDetail || null,
      budgetRange: body.budgetRange || null,
      timeline: body.timeline || null,
      offerInterest: body.offerInterest || null,
      status: 'new',
      fitScore: body.fitScore || null,
      notesSummary: body.notes || null,
      brandId: body.brandId || 'ChromaPages',
      pipelineId: body.pipelineId || null,
      stageId: body.stageId || null,
      ownerUserId: body.ownerUserId || null,
      companyId: companyId || null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await db.collection('leads').add(leadData);
    const leadId = docRef.id;

    // Discord notification
    notifyDiscordOfLead({
      leadId,
      companyName: leadData.companyName,
      fullName: leadData.fullName,
      tradeOrVertical: leadData.tradeOrVertical,
      source: leadData.source,
      email: leadData.email,
      phone: leadData.phone,
    }).catch(err => console.error('Discord notification failed:', err));

    return NextResponse.json({ success: true, leadId, companyId, message: 'Lead created and linked' }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/leads error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitCount = parseInt(searchParams.get('limit') || '50');

    const snapshot = await db.collection('leads')
      .orderBy('createdAt', 'desc')
      .limit(limitCount)
      .get();

    const leads = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()?.toISOString(),
      updatedAt: doc.data().updatedAt?.toDate()?.toISOString(),
    }));

    return NextResponse.json({ success: true, leads });
  } catch (error: any) {
    console.error('GET /api/leads error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
