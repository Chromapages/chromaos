import { db } from '@/lib/firebase';
import { doc, getDoc, getDocs, collection, query, where, orderBy, limit } from 'firebase/firestore';
import { Company, Lead, Deal, Task, Activity, Brand } from './types';

export async function getCompanyContext(companyId: string) {
  // 1. Fetch the company document
  const companySnap = await getDoc(doc(db, 'companies', companyId));
  if (!companySnap.exists()) throw new Error('Company not found');
  const company = { id: companySnap.id, ...companySnap.data() } as Company;

  // 2. Fetch linked leads
  const leadsQuery = query(collection(db, 'leads'), where('companyId', '==', companyId));
  const leadsSnap = await getDocs(leadsQuery);
  const leads = leadsSnap.docs.map(d => ({ id: d.id, ...d.data() }) as Lead);

  // 3. Fetch linked deals
  const dealsQuery = query(collection(db, 'deals'), where('companyId', '==', companyId));
  const dealsSnap = await getDocs(dealsQuery);
  const deals = dealsSnap.docs.map(d => ({ id: d.id, ...d.data() }) as Deal);

  // 4. Fetch open tasks for this company (tasks linked directly, not via lead)
  const tasksQuery = query(
    collection(db, 'tasks'),
    where('companyId', '==', companyId),
    where('status', 'in', ['open', 'in_progress']),
    limit(10)
  );
  const tasksSnap = await getDocs(tasksQuery);
  const tasks = tasksSnap.docs.map(d => ({ id: d.id, ...d.data() }) as Task);

  // 5. Fetch recent activities
  const activitiesQuery = query(
    collection(db, 'activities'),
    where('recordId', '==', companyId),
    orderBy('createdAt', 'desc'),
    limit(10)
  );
  const activitiesSnap = await getDocs(activitiesQuery);
  const activities = activitiesSnap.docs.map(d => ({ id: d.id, ...d.data() }) as Activity);

  // 6. Fetch brand if brandId exists
  let brand: Brand | null = null;
  if (company.brandId) {
    const brandSnap = await getDoc(doc(db, 'brands', company.brandId));
    brand = brandSnap.exists() ? ({ id: brandSnap.id, ...brandSnap.data() } as Brand) : null;
  }

  return { company, leads, deals, tasks, activities, brand };
}
