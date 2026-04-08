import { NextRequest, NextResponse } from 'next/server';
import { db, Timestamp } from '@/lib/firebase-admin';
import { getOrCreateCompany } from '@/lib/crm/company-helper';
import { createClientFolder } from '@/lib/crm/createClientFolder';

// POST /api/leads/[leadId]/convert-customer
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const { leadId } = await params;
    if (!leadId) {
      return NextResponse.json({ error: 'leadId is required' }, { status: 400 });
    }

    // 1. Update lead status to 'customer' and set convertedAt
    await db.collection('leads').doc(leadId).update({
      status: 'customer',
      convertedAt: Timestamp.now(),
    });

    // 2. Fetch the lead to get company info
    const leadSnap = await db.collection('leads').doc(leadId).get();
    const leadData = leadSnap.data();
    const companyName = leadData?.companyName ?? leadData?.fullName ?? 'Unknown';
    const companyWebsite = leadData?.website ?? '';
    const brandId = leadData?.brandId ?? 'ChromaPages';

    // 3. Get or create company
    const companyId = await getOrCreateCompany({
      name: companyName,
      website: companyWebsite,
      brandId,
    });

    // 4. Create a won Deal
    const dealRef = await db.collection('deals').add({
      leadId,
      companyId: companyId || null,
      title: `${companyName} - Website Project`,
      status: 'won',
      stageId: 'won',
      createdAt: Timestamp.now(),
    });

    // 5. Create the client folder shell on MiDrive
    const { folderPath } = await createClientFolder(companyName);

    // 6. Persist the folder path on the lead
    await db.collection('leads').doc(leadId).update({
      clientFolderPath: folderPath,
    });

    return NextResponse.json({
      success: true,
      leadId,
      companyId: companyId || null,
      dealId: dealRef.id,
      clientFolderPath: folderPath,
    });
  } catch (error: any) {
    console.error('POST /api/leads/[leadId]/convert-customer error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}