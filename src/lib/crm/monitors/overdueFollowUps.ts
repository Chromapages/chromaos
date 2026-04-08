import { db, Timestamp } from '@/lib/firebase-admin';
import { pushAlert } from '../chromaContext';

export async function checkOverdueFollowUps() {
  const now = new Date();

  const snap = await db.collection('tasks')
    .where('status', '==', 'open')
    .where('dueDate', '<', Timestamp.fromDate(now))
    // Note: Firestore doesn't support 'in' with other inequality filters on different fields,
    // but here we are using '==' for status and '<' for dueDate, then in-memory filtering for priority
    .get();

  const results: string[] = [];

  for (const doc of snap.docs) {
    const data = doc.data();
    if (!['high', 'medium'].includes(data.priority)) continue;

    await pushAlert({
      type: 'overdue_task',
      priority: data.priority === 'high' ? 'urgent' : 'high',
      message: `Overdue follow-up: ${data.title}`,
      leadId: data.leadId,
      dealId: data.dealId,
      metadata: { taskId: doc.id, dueDate: data.dueDate?.toDate()?.toISOString() },
    });
    results.push(doc.id);
  }

  return { checked: snap.size, alerted: results.length };
}
