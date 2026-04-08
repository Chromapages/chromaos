import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { Company } from '@/lib/crm/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId');
    
    let query = db.collection('companies').orderBy('createdAt', 'desc');
    
    if (brandId) {
      query = query.where('brandId', '==', brandId);
    }
    
    const snapshot = await query.get();
    const companies = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()?.toISOString()
    }));
    
    return NextResponse.json({ companies });
  } catch (error: any) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, website, industry, brandId } = body;
    
    if (!name) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
    }
    
    const companyData: Partial<Company> = {
      name,
      website,
      industry,
      brandId,
      createdAt: Timestamp.now()
    };
    
    const docRef = await db.collection('companies').add(companyData);
    
    return NextResponse.json({ 
      id: docRef.id, 
      message: 'Company created successfully' 
    });
  } catch (error: any) {
    console.error('Error creating company:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
