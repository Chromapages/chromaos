import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ companyId: string }> }
) {
  try {
    const { companyId } = await params;
    
    // Get company record
    const companyDoc = await db.collection('companies').doc(companyId).get();
    
    if (!companyDoc.exists) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }
    
    const company = {
      id: companyDoc.id,
      ...companyDoc.data(),
      createdAt: companyDoc.data()?.createdAt?.toDate()?.toISOString()
    };
    
    // Get linked leads
    const leadsSnapshot = await db.collection('leads')
      .where('companyId', '==', companyId)
      .get();
      
    const leads = leadsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()?.toISOString()
    }));
    
    // Get linked deals
    const dealsSnapshot = await db.collection('deals')
      .where('companyId', '==', companyId)
      .get();
      
    const deals = dealsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()?.toISOString()
    }));
    
    // Get activities
    const activitiesSnapshot = await db.collection('activities')
      .where('recordId', '==', companyId)
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();
      
    const activities = activitiesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()?.toISOString()
    }));
    
    return NextResponse.json({ 
      company, 
      leads, 
      deals, 
      activities 
    });
  } catch (error: any) {
    console.error('Error fetching company details:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
