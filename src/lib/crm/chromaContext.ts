import { db, Timestamp } from '@/lib/firebase-admin';

// Collection paths
const AGENTS_COL = 'agents';
const CHROMA_DOC = 'chroma';
const GLOBAL_DOC = '_global';

const getContextPath = (threadId?: string) => 
  `${AGENTS_COL}/${CHROMA_DOC}/${threadId ? `threads/${threadId}` : GLOBAL_DOC}/${threadId || 'state'}`;

// === ALERTS ===

export interface ChromaAlert {
  id: string;
  type: 'new_lead' | 'stale_deal' | 'unclassified_lead' | 'missing_folder' | 'overdue_task' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  message: string;
  leadId?: string;
  dealId?: string;
  metadata?: Record<string, any>;
  createdAt: any;
  acknowledged: boolean;
  acknowledgedAt?: any;
  acknowledgedBy?: string;
}

export async function pushAlert(alert: Omit<ChromaAlert, 'id' | 'createdAt' | 'acknowledged'>): Promise<string> {
  const col = db.collection(AGENTS_COL).doc(CHROMA_DOC).collection(GLOBAL_DOC).doc('alerts').collection('items');
  const docData = {
    ...alert,
    createdAt: Timestamp.now(),
    acknowledged: false,
  };
  const ref = await col.add(docData);
  return ref.id;
}

export async function getUnacknowledgedAlerts(): Promise<ChromaAlert[]> {
  const snap = await db.collection(AGENTS_COL).doc(CHROMA_DOC).collection(GLOBAL_DOC).doc('alerts').collection('items')
    .where('acknowledged', '==', false)
    .orderBy('createdAt', 'desc')
    .limit(50)
    .get();
    
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ChromaAlert));
}

export async function acknowledgeAlert(alertId: string, acknowledgedBy: string = 'chroma'): Promise<void> {
  await db.collection(AGENTS_COL).doc(CHROMA_DOC).collection(GLOBAL_DOC).doc('alerts').collection('items').doc(alertId).update({
    acknowledged: true,
    acknowledgedAt: Timestamp.now(),
    acknowledgedBy,
  });
}

// === PIPELINE QUEUE ===

export interface QueuedAction {
  id: string;
  leadId?: string;
  dealId?: string;
  action: 'classify' | 'analyze_website' | 'follow_up' | 'create_project' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  createdAt: any;
  status: 'pending' | 'in_progress' | 'completed';
  completedAt?: any;
}

export async function queueAction(action: Omit<QueuedAction, 'id' | 'createdAt' | 'status'>): Promise<string> {
  const col = db.collection(AGENTS_COL).doc(CHROMA_DOC).collection(GLOBAL_DOC).doc('pipelineQueue').collection('items');
  const docData = {
    ...action,
    status: 'pending',
    createdAt: Timestamp.now(),
  };
  const ref = await col.add(docData);
  return ref.id;
}

export async function getPendingActions(): Promise<QueuedAction[]> {
  const snap = await db.collection(AGENTS_COL).doc(CHROMA_DOC).collection(GLOBAL_DOC).doc('pipelineQueue').collection('items')
    .where('status', '==', 'pending')
    .orderBy('priority', 'desc')
    .orderBy('createdAt', 'asc')
    .limit(20)
    .get();
    
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as QueuedAction));
}

export async function markActionCompleted(actionId: string): Promise<void> {
  await db.collection(AGENTS_COL).doc(CHROMA_DOC).collection(GLOBAL_DOC).doc('pipelineQueue').collection('items').doc(actionId).update({
    status: 'completed',
    completedAt: Timestamp.now(),
  });
}

// === ACTIVE PROJECTS ===

export interface ActiveProject {
  id: string;
  leadId?: string;
  companyName: string;
  clientFolderPath: string;
  stage: 'brief' | 'strategy' | 'content' | 'design' | 'build' | 'qa' | 'delivery';
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  lastActivity: any;
  nextStep?: string;
  createdAt: any;
}

export async function registerProject(project: Omit<ActiveProject, 'id' | 'createdAt' | 'lastActivity'>): Promise<string> {
  const col = db.collection(AGENTS_COL).doc(CHROMA_DOC).collection(GLOBAL_DOC).doc('activeProjects').collection('items');
  const docData = {
    ...project,
    lastActivity: Timestamp.now(),
    createdAt: Timestamp.now(),
  };
  const ref = await col.add(docData);
  return ref.id;
}

export async function updateProjectActivity(projectId: string, nextStep?: string): Promise<void> {
  const updates: Record<string, any> = { lastActivity: Timestamp.now() };
  if (nextStep) updates.nextStep = nextStep;
  await db.collection(AGENTS_COL).doc(CHROMA_DOC).collection(GLOBAL_DOC).doc('activeProjects').collection('items').doc(projectId).update(updates);
}

export async function getActiveProjects(): Promise<ActiveProject[]> {
  const snap = await db.collection(AGENTS_COL).doc(CHROMA_DOC).collection(GLOBAL_DOC).doc('activeProjects').collection('items')
    .where('status', '==', 'active')
    .orderBy('lastActivity', 'desc')
    .limit(20)
    .get();
    
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ActiveProject));
}

// === CONTEXT READ (for Chroma) ===

export async function getChromaContext(): Promise<{
  alerts: ChromaAlert[];
  pendingActions: QueuedAction[];
  activeProjects: ActiveProject[];
}> {
  const [alerts, pendingActions, activeProjects] = await Promise.all([
    getUnacknowledgedAlerts(),
    getPendingActions(),
    getActiveProjects(),
  ]);
  return { alerts, pendingActions, activeProjects };
}
