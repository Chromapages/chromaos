import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function logActivity(params: {
  recordId: string;
  recordType: 'lead' | 'company' | 'deal' | 'task';
  activityType: string;
  summary: string;
  agentName: string;
  metadata?: Record<string, any>;
}) {
  const docData = {
    recordId: params.recordId,
    recordType: params.recordType,
    activityType: params.activityType,
    summary: params.summary,
    agentName: params.agentName,
    metadata: params.metadata || null,
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, 'activities'), docData);
  return docRef.id;
}
