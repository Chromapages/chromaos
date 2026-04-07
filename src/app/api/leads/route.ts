import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { notifyDiscordOfLead } from '@/lib/crm/notifyDiscord';

// POST /api/leads — create a new lead (from forms, external services, or manual entry)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Required fields
    const { fullName, companyName, website, tradeOrVertical, source } = body;

    if (!fullName && !companyName) {
      return NextResponse.json(
        { error: 'fullName or companyName is required' },
        { status: 400 }
      );
    }

    // Build the lead document
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
      fitScore: null,
      notesSummary: body.notes || null,
      brandId: body.brandId || null,
      pipelineId: body.pipelineId || null,
      stageId: body.stageId || null,
      ownerUserId: body.ownerUserId || null,
      companyId: null, // created separately if company exists
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Save to Firestore
    const docRef = await addDoc(collection(db, 'leads'), leadData);
    const leadId = docRef.id;

    // Send Discord notification (async — don't block on it)
    notifyDiscordOfLead({
      leadId,
      companyName: leadData.companyName,
      fullName: leadData.fullName,
      tradeOrVertical: leadData.tradeOrVertical,
      source: leadData.source,
      email: leadData.email,
      phone: leadData.phone,
    }).catch((err) => console.error('Discord notification failed:', err));

    return NextResponse.json(
      { success: true, leadId, message: 'Lead created' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('POST /api/leads error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
