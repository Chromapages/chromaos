import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

interface TaskParams {
  leadId?: string;
  companyId?: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority?: 'low' | 'medium' | 'high';
}

export async function createLeadTask(params: TaskParams) {
  const { dueDate, priority = 'medium', ...rest } = params;

  const taskData = {
    ...rest,
    status: 'open' as const,
    priority,
    dueDate: Timestamp.fromDate(dueDate),
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, 'tasks'), taskData);
  return docRef.id;
}