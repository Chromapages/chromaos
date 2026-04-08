import { pushAlert } from './chromaContext';

export async function alertNewLead(leadId: string, companyName: string, priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium') {
  return pushAlert({
    type: 'new_lead',
    priority,
    message: `New lead: ${companyName}`,
    leadId,
  });
}

export async function alertUnclassifiedLead(leadId: string, companyName: string, hoursOld: number) {
  return pushAlert({
    type: 'unclassified_lead',
    priority: hoursOld > 48 ? 'high' : 'medium',
    message: `Lead unclassified for ${hoursOld}h: ${companyName}`,
    leadId,
    metadata: { hoursOld },
  });
}

export async function alertStaleDeal(dealId: string, companyName: string, daysStale: number) {
  return pushAlert({
    type: 'stale_deal',
    priority: 'medium',
    message: `Deal stale for ${daysStale}+ days: ${companyName}`,
    dealId,
    metadata: { daysStale },
  });
}

export async function alertMissingFolder(leadId: string, companyName: string) {
  return pushAlert({
    type: 'missing_folder',
    priority: 'high',
    message: `New customer without project folder: ${companyName}`,
    leadId,
  });
}
