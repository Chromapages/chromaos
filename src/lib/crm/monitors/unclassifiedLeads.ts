import { db, Timestamp } from '@/lib/firebase-admin';

export async function checkUnclassifiedLeads() {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

  const snap = await db.collection('leads')
    .where('status', '==', 'New')
    .where('createdAt', '<=', Timestamp.fromDate(cutoff))
    .get();

  const results: string[] = [];

  for (const doc of snap.docs) {
    const data = doc.data();
    // Skip if already classified
    if (data.disposition) continue;

    results.push(doc.id);
  }

  return { checked: snap.size, needsClassification: results };
}
