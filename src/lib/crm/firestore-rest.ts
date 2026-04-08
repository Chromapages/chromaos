/**
 * Firestore REST API client — no Firebase Admin SDK needed.
 * Uses a Google Cloud API key with limited Firestore access.
 * 
 * Requires env var: GOOGLE_CLOUD_API_KEY
 */

const PROJECT_ID = 'chromaos-4d17c';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

function getApiKey(): string {
  const key = process.env.GOOGLE_CLOUD_API_KEY;
  if (!key) throw new Error('GOOGLE_CLOUD_API_KEY env var not set');
  return key;
}

function masks(data: Record<string, any>): string {
  return Object.keys(data)
    .filter(k => data[k] !== undefined && data[k] !== null)
    .join(',');
}

function firestoreValue(val: any): any {
  if (val === null || val === undefined) return null;
  if (typeof val === 'string') return { stringValue: val };
  if (typeof val === 'number') return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (val instanceof Date) return { timestampValue: val.toISOString() };
  if (Array.isArray(val)) return { arrayValue: { values: val.map(firestoreValue) } };
  if (typeof val === 'object') {
    const entries: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      if (v !== undefined) entries[k] = firestoreValue(v);
    }
    return { mapValue: { fields: entries } };
  }
  return { stringValue: String(val) };
}

// === LEAD CLASSIFICATION ===

export async function writeLeadClassificationFields(leadId: string, data: Record<string, any>): Promise<void> {
  const url = `${BASE_URL}/leads/${leadId}?updateMask=${masks(data)}&key=${getApiKey()}`;
  const body = {
    fields: firestoreValue(data)
  };
  
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Firestore write failed: ${err}`);
  }
}

// === CREATE TASK ===

export async function createTaskDocument(data: {
  title: string;
  description?: string;
  dueDate: Date | string;
  priority?: string;
  leadId?: string;
  companyId?: string;
  status?: string;
}): Promise<string> {
  const docData: Record<string, any> = {
    title: data.title,
    dueDate: data.dueDate instanceof Date ? data.dueDate.toISOString() : data.dueDate,
    priority: data.priority || 'medium',
    status: data.status || 'open',
    createdAt: new Date().toISOString(),
  };
  if (data.description) docData.description = data.description;
  if (data.leadId) docData.leadId = data.leadId;
  if (data.companyId) docData.companyId = data.companyId;

  const url = `${BASE_URL}/tasks?body=document&key=${getApiKey()}`;
  const body = {
    fields: firestoreValue(docData)
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Create task failed: ${err}`);
  }

  const result = await res.json();
  // Document name is like: "projects/chromaos-4d17c/databases/(default)/documents/tasks/ABC123"
  const parts = result.name?.split('/');
  return parts?.[parts.length - 1] ?? '';
}

// === ALERTS ===

export async function pushAlertDocument(data: {
  type: string;
  priority?: string;
  message: string;
  leadId?: string;
  dealId?: string;
  metadata?: Record<string, any>;
}): Promise<string> {
  const docData: Record<string, any> = {
    type: data.type,
    priority: data.priority || 'medium',
    message: data.message,
    createdAt: new Date().toISOString(),
    acknowledged: false,
  };
  if (data.leadId) docData.leadId = data.leadId;
  if (data.dealId) docData.dealId = data.dealId;
  if (data.metadata) docData.metadata = data.metadata;

  const url = `${BASE_URL}/agents/chroma/alerts?body=document&key=${getApiKey()}`;
  const body = { fields: firestoreValue(docData) };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Push alert failed: ${err}`);
  }

  const result = await res.json();
  const parts = result.name?.split('/');
  return parts?.[parts.length - 1] ?? '';
}

export async function acknowledgeAlertDocument(alertId: string, acknowledgedBy: string = 'chroma'): Promise<void> {
  const url = `${BASE_URL}/agents/chroma/alerts/${alertId}?updateMask=acknowledged,acknowledgedAt,acknowledgedBy&key=${getApiKey()}`;
  const body = {
    fields: firestoreValue({
      acknowledged: true,
      acknowledgedAt: new Date().toISOString(),
      acknowledgedBy,
    })
  };

  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Acknowledge alert failed: ${err}`);
  }
}

// === CONTEXT READ ===

export async function queryCollection(collectionPath: string, queries?: Array<{ field: string; op: string; value: any }>, limitCount: number = 50): Promise<Array<{ id: string; fields: Record<string, any> }>> {
  const structuredQuery: any = {
    from: [{ collectionId: collectionPath }],
    limit: limitCount,
  };

  if (queries && queries.length > 0) {
    structuredQuery.where = {
      compositeFilter: {
        op: 'AND',
        filters: queries.map(q => ({
          fieldFilter: {
            field: { fieldPath: q.field },
            op: q.op,
            value: firestoreValue(q.value),
          },
        })),
      },
    };
  }

  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery?key=${getApiKey()}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ structuredQuery }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Query ${collectionPath} failed: ${err}`);
  }

  const results = await res.json();
  return results
    .filter((r: any) => r.document)
    .map((r: any) => {
      const name = r.document.name;
      const parts = name.split('/');
      const id = parts[parts.length - 1];
      return { id, fields: r.document.fields || {} };
    });
}

export function decodeFirestoreValue(val: any): any {
  if (!val) return null;
  if (val.stringValue !== undefined) return val.stringValue;
  if (val.integerValue !== undefined) return parseInt(val.integerValue, 10);
  if (val.doubleValue !== undefined) return parseFloat(val.doubleValue);
  if (val.booleanValue !== undefined) return val.booleanValue;
  if (val.timestampValue !== undefined) return val.timestampValue;
  if (val.arrayValue?.values) return val.arrayValue.values.map(decodeFirestoreValue);
  if (val.mapValue?.fields) {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(val.mapValue.fields)) {
      out[k] = decodeFirestoreValue(v);
    }
    return out;
  }
  return null;
}

export async function getChromaContext(): Promise<{
  alerts: any[];
  pendingActions: any[];
  activeProjects: any[];
}> {
  const [alertsRaw, actionsRaw, projectsRaw] = await Promise.all([
    queryCollection('agents/chroma/alerts', [{ field: 'acknowledged', op: 'EQUAL', value: false }]),
    queryCollection('agents/chroma/pipelineQueue', [{ field: 'status', op: 'EQUAL', value: 'pending' }]),
    queryCollection('agents/chroma/activeProjects', [{ field: 'status', op: 'EQUAL', value: 'active' }]),
  ]);

  function clean(items: Array<{ id: string; fields: Record<string, any> }>) {
    return items.map(({ id, fields }) => ({ id, ...Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, decodeFirestoreValue(v)])) }));
  }

  return {
    alerts: clean(alertsRaw),
    pendingActions: clean(actionsRaw),
    activeProjects: clean(projectsRaw),
  };
}
