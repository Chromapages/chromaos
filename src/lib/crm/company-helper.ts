import { db, Timestamp } from '@/lib/firebase-admin';
import { Company } from './types';

/**
 * Finds an existing company by name or website, or creates a new one.
 * Returns the company ID.
 */
export async function getOrCreateCompany(data: {
  name: string;
  website?: string;
  brandId?: string;
  industry?: string;
}): Promise<string> {
  const { name, website, brandId, industry } = data;

  if (!name || name === 'Unknown') return '';

  // 1. Try matching by Name
  const nameMatch = await db.collection('companies')
    .where('name', '==', name)
    .limit(1)
    .get();

  if (!nameMatch.empty) {
    return nameMatch.docs[0].id;
  }

  // 2. Try matching by Website (if provided)
  if (website && website !== 'Unknown') {
    const websiteMatch = await db.collection('companies')
      .where('website', '==', website)
      .limit(1)
      .get();

    if (!websiteMatch.empty) {
      return websiteMatch.docs[0].id;
    }
  }

  // 3. Create new company if no match found
  const newCompany: Partial<Company> = {
    name,
    website: website || '',
    industry: industry || 'Unknown',
    brandId: brandId || 'ChromaPages',
    createdAt: Timestamp.now()
  };

  const docRef = await db.collection('companies').add(newCompany);
  
  // Log activity for new company creation
  await db.collection('activities').add({
    recordId: docRef.id,
    recordType: 'company',
    activityType: 'create',
    summary: `Company profile auto-created from lead intake: ${name}`,
    agentName: 'ChromaOS Bridge',
    createdAt: Timestamp.now()
  });

  return docRef.id;
}
