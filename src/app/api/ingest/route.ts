import { NextResponse } from 'next/server';
import { db, Timestamp } from '@/lib/firebase-admin';
import { sendDiscordNotification } from '@/lib/notifications';
import { Lead } from '@/lib/crm/types';
import { getOrCreateCompany } from '@/lib/crm/company-helper';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const apiKey = process.env.INGESTION_API_KEY;

    if (!authHeader || authHeader !== `Bearer ${apiKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      fullName, 
      email, 
      phone, 
      companyName, 
      website, 
      source, 
      sourceDetail,
      brandId,
      notesSummary,
      fitScore
    } = body;

    if (!email || !fullName) {
      return NextResponse.json({ 
        error: 'Missing required fields: email and fullName are mandatory' 
      }, { status: 400 });
    }

    // Basic deduplication
    const existingLeads = await db.collection('leads')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!existingLeads.empty) {
      return NextResponse.json({ 
        message: 'Lead already exists', 
        id: existingLeads.docs[0].id 
      }, { status: 200 });
    }

    // Lead-to-Company Matching Bridge
    const companyId = await getOrCreateCompany({
      name: companyName || fullName || 'Unknown',
      website: website || undefined,
      brandId: brandId || 'ChromaPages',
      industry: body.industry || 'Unknown'
    });

    const leadData: Partial<Lead> = {
      fullName: fullName || undefined,
      email: email || undefined,
      phone: phone || undefined,
      companyName: companyName || undefined,
      website: website || undefined,
      source: source || 'API',
      sourceDetail: sourceDetail || 'External Ingestion',
      brandId: brandId || 'ChromaPages',
      notesSummary: notesSummary || undefined,
      fitScore: fitScore || 5,
      status: 'New',
      companyId: companyId || undefined,
      createdAt: Timestamp.now()
    };

    const docRef = await db.collection('leads').add(leadData);
    const newLead = { id: docRef.id, ...leadData };

    // Async notification (don't block the response)
    sendDiscordNotification(newLead).catch(console.error);

    return NextResponse.json({ 
      id: docRef.id, 
      message: 'Lead ingested successfully' 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Ingestion error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
