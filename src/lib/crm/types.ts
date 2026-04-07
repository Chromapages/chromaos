export interface Lead {
  id: string;
  fullName?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  website?: string;
  tradeOrVertical?: string;
  source?: string;
  sourceDetail?: string;
  budgetRange?: string;
  timeline?: string;
  offerInterest?: string;
  status?: string;
  fitScore?: number;
  notesSummary?: string;
  companyId?: string;
  brandId?: string;
  pipelineId?: string;
  createdAt?: any;
}

export interface Company {
  id: string;
  name?: string;
  website?: string;
  industry?: string;
  brandId?: string;
  createdAt?: any;
}

export interface Deal {
  id: string;
  leadId: string;
  companyId?: string;
  title: string;
  amount?: number;
  stageId?: string;
  status: 'open' | 'won' | 'lost';
  createdAt?: any;
}

export interface Task {
  id: string;
  leadId?: string;
  companyId?: string;
  title: string;
  description?: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  dueDate?: any;
  createdAt?: any;
}

export interface Activity {
  id: string;
  recordId: string;
  recordType: 'lead' | 'company' | 'deal' | 'task';
  activityType: string;
  summary: string;
  agentName: string;
  metadata?: any;
  createdAt?: any;
}

export interface Brand {
  id: string;
  name: string;
  description?: string;
  createdAt?: any;
}

export interface PipelineStage {
  id: string;
  pipelineId: string;
  name: string;
  order: number;
}
