import { db } from '@/lib/firebase';
import { doc, updateDoc, collection, addDoc, query, where, getDocs, limit, Timestamp } from 'firebase/firestore';

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
  const col = collection(db, 'agents/chroma/alerts');
  const docData = {
    ...alert,
    createdAt: Timestamp.now(),
    acknowledged: false,
  };
  const ref = await addDoc(col, docData);
  return ref.id;
}

export async function getUnacknowledgedAlerts(): Promise<ChromaAlert[]> {
  // Simple query — no composite index needed
  const q = query(
    collection(db, 'agents/chroma/alerts'),
    where('acknowledged', '==', false),
    limit(50)
  );
  const snap = await getDocs(q);
  const alerts = snap.docs.map(d => ({ id: d.id, ...d.data() } as ChromaAlert));
  // Sort in JS — no index needed
  return alerts.sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() ?? 0;
    const bTime = b.createdAt?.toMillis?.() ?? 0;
    return bTime - aTime;
  });
}

export async function acknowledgeAlert(alertId: string, acknowledgedBy: string = 'chroma'): Promise<void> {
  await updateDoc(doc(db, 'agents/chroma/alerts', alertId), {
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
  const col = collection(db, 'agents/chroma/pipelineQueue');
  const docData = {
    ...action,
    status: 'pending' as const,
    createdAt: Timestamp.now(),
  };
  const ref = await addDoc(col, docData);
  return ref.id;
}

export async function getPendingActions(): Promise<QueuedAction[]> {
  const q = query(
    collection(db, 'agents/chroma/pipelineQueue'),
    where('status', '==', 'pending'),
    limit(20)
  );
  const snap = await getDocs(q);
  const actions = snap.docs.map(d => ({ id: d.id, ...d.data() } as QueuedAction));
  // Sort by priority then createdAt in JS — no composite index needed
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  return actions.sort((a, b) => {
    const pDiff = (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3);
    if (pDiff !== 0) return pDiff;
    const aTime = a.createdAt?.toMillis?.() ?? 0;
    const bTime = b.createdAt?.toMillis?.() ?? 0;
    return aTime - bTime;
  });
}

export async function markActionCompleted(actionId: string): Promise<void> {
  await updateDoc(doc(db, 'agents/chroma/_global/pipelineQueue', actionId), {
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
  const col = collection(db, 'agents/chroma/activeProjects');
  const docData = {
    ...project,
    lastActivity: Timestamp.now(),
    createdAt: Timestamp.now(),
  };
  const ref = await addDoc(col, docData);
  return ref.id;
}

export async function updateProjectActivity(projectId: string, nextStep?: string): Promise<void> {
  const updates: Record<string, any> = { lastActivity: Timestamp.now() };
  if (nextStep) updates.nextStep = nextStep;
  await updateDoc(doc(db, 'agents/chroma/activeProjects', projectId), updates);
}

export async function getActiveProjects(): Promise<ActiveProject[]> {
  const q = query(
    collection(db, 'agents/chroma/activeProjects'),
    where('status', '==', 'active'),
    limit(20)
  );
  const snap = await getDocs(q);
  const projects = snap.docs.map(d => ({ id: d.id, ...d.data() } as ActiveProject));
  // Sort by lastActivity in JS — no index needed
  return projects.sort((a, b) => {
    const aTime = a.lastActivity?.toMillis?.() ?? 0;
    const bTime = b.lastActivity?.toMillis?.() ?? 0;
    return bTime - aTime;
  });
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
