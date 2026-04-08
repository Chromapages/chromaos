import { db } from '@/lib/firebase';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';

interface ClassificationParams {
  leadId: string;
  disposition: string;
  nextAction?: string;
  followUpDate?: Date;
  classificationConfidence?: number;
  urgencyLevel?: string;
  packageFit?: string;
  riskFlags?: string[];
  agentSummary?: string;
  classificationAgent?: string;
}

export async function writeLeadClassification(params: ClassificationParams) {
  const { leadId, followUpDate, ...rest } = params;

  // Filter out undefined values — Firestore doesn't accept them
  const updateData: Record<string, any> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (value !== undefined && value !== null && value !== '') {
      updateData[key] = value;
    }
  }
  updateData.classifiedAt = Timestamp.now();

  if (followUpDate) {
    updateData.followUpDate = Timestamp.fromDate(followUpDate);
  }

  await updateDoc(doc(db, 'leads', leadId), updateData);
}
