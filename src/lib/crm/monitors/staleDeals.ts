import { db, Timestamp } from '@/lib/firebase-admin';
import { alertStaleDeal } from '../chromaAlerts';

export async function checkStaleDeals() {
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

  const snap = await db.collection('deals')
    .where('status', '==', 'open')
    .where('updatedAt', '<', Timestamp.fromDate(cutoff))
    .get();

  const results: string[] = [];

  for (const doc of snap.docs) {
    const data = doc.data();
    const daysStale = Math.round(
      (Date.now() - data.updatedAt?.toDate().getTime()) / (1000 * 60 * 60 * 24)
    );
    await alertStaleDeal(doc.id, data.title || 'Deal', daysStale);
    results.push(doc.id);
  }

  return { checked: snap.size, alerted: results.length };
}
