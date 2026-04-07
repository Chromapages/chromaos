import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function saveAgentRun(params: {
  leadId: string;
  companyId?: string;
  dealId?: string;
  agentName: string;
  action: string;
  output: Record<string, any>;
  metadata?: Record<string, any>;
}) {
  const docData = {
    leadId: params.leadId,
    companyId: params.companyId || null,
    dealId: params.dealId || null,
    agentName: params.agentName,
    action: params.action,
    output: params.output,
    metadata: params.metadata || null,
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, 'agentRuns'), docData);
  return docRef.id;
}
