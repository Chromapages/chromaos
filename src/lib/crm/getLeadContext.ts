import { db } from '@/lib/firebase';
import { doc, getDoc, getDocs, collection, query, where, orderBy, limit } from 'firebase/firestore';
import { Lead, Company, Deal, Task, Activity, Brand, PipelineStage } from './types';

export async function getLeadContext(leadId: string) {
  // 1. Fetch the lead document
  const leadSnap = await getDoc(doc(db, 'leads', leadId));
  if (!leadSnap.exists()) throw new Error('Lead not found');
  const lead = { id: leadSnap.id, ...leadSnap.data() } as Lead;

  // 2. Fetch linked company if companyId exists
  let company: Company | null = null;
  if (lead.companyId) {
    const companySnap = await getDoc(doc(db, 'companies', lead.companyId));
    company = companySnap.exists() ? ({ id: companySnap.id, ...companySnap.data() } as Company) : null;
  }

  // 3. Fetch linked deals
  const dealsQuery = query(collection(db, 'deals'), where('leadId', '==', leadId));
  const dealsSnap = await getDocs(dealsQuery);
  const deals = dealsSnap.docs.map(d => ({ id: d.id, ...d.data() }) as Deal);

  // 4. Fetch open tasks for this lead
  const tasksQuery = query(
    collection(db, 'tasks'),
    where('leadId', '==', leadId),
    where('status', 'in', ['open', 'in_progress']),
    limit(10)
  );
  const tasksSnap = await getDocs(tasksQuery);
  const tasks = tasksSnap.docs.map(d => ({ id: d.id, ...d.data() }) as Task);

  // 5. Fetch recent activities
  const activitiesQuery = query(
    collection(db, 'activities'),
    where('recordId', '==', leadId),
    orderBy('createdAt', 'desc'),
    limit(10)
  );
  const activitiesSnap = await getDocs(activitiesQuery);
  const activities = activitiesSnap.docs.map(d => ({ id: d.id, ...d.data() }) as Activity);

  // 6. Fetch brand if brandId exists
  let brand: Brand | null = null;
  if (lead.brandId) {
    const brandSnap = await getDoc(doc(db, 'brands', lead.brandId));
    brand = brandSnap.exists() ? ({ id: brandSnap.id, ...brandSnap.data() } as Brand) : null;
  }

  // 7. Fetch pipelineStages for the lead's pipelineId
  let pipelineStages: PipelineStage[] = [];
  if (lead.pipelineId) {
    const stagesQuery = query(collection(db, 'pipelineStages'), where('pipelineId', '==', lead.pipelineId));
    const stagesSnap = await getDocs(stagesQuery);
    pipelineStages = stagesSnap.docs.map(d => ({ id: d.id, ...d.data() }) as PipelineStage);
  }

  return { lead, company, deals, tasks, activities, brand, pipelineStages };
}
