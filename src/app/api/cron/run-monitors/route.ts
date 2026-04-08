import { NextRequest, NextResponse } from 'next/server';
import { checkUnclassifiedLeads } from '@/lib/crm/monitors/unclassifiedLeads';
import { checkStaleDeals } from '@/lib/crm/monitors/staleDeals';
import { checkMissingFolders } from '@/lib/crm/monitors/missingFolders';
import { checkOverdueFollowUps } from '@/lib/crm/monitors/overdueFollowUps';

export async function GET(request: NextRequest) {
  // Optional: verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  const CRON_SECRET = process.env.CRON_SECRET || '';
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const results = await Promise.allSettled([
      checkUnclassifiedLeads(),
      checkStaleDeals(),
      checkMissingFolders(),
      checkOverdueFollowUps(),
    ]);

    const summary = {
      unclassified: results[0].status === 'fulfilled' ? (results[0] as PromiseFulfilledResult<any>).value : (results[0] as PromiseRejectedResult).reason,
      staleDeals: results[1].status === 'fulfilled' ? (results[1] as PromiseFulfilledResult<any>).value : (results[1] as PromiseRejectedResult).reason,
      missingFolders: results[2].status === 'fulfilled' ? (results[2] as PromiseFulfilledResult<any>).value : (results[2] as PromiseRejectedResult).reason,
      overdueTasks: results[3].status === 'fulfilled' ? (results[3] as PromiseFulfilledResult<any>).value : (results[3] as PromiseRejectedResult).reason,
      timestamp: new Date().toISOString(),
      automation: { classificationTriggered: 0, failures: 0 },
    };

    // Automated Processing Loop
    if (results[0].status === 'fulfilled' && results[0].value.needsClassification?.length > 0) {
      const baseUrl = request.nextUrl.origin;
      const leads = results[0].value.needsClassification;
      
      for (const leadId of leads) {
        try {
          const res = await fetch(`${baseUrl}/api/agent/lead-classify`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'x-api-key': process.env.OPENCLAW_API_KEY || '' 
            },
            body: JSON.stringify({ leadId }),
          });
          if (res.ok) summary.automation.classificationTriggered++;
          else summary.automation.failures++;
        } catch (err) {
          console.error(`Automation failed for lead ${leadId}:`, err);
          summary.automation.failures++;
        }
      }
    }

    return NextResponse.json({ success: true, results: summary });
  } catch (error: any) {
    console.error('Cron error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
