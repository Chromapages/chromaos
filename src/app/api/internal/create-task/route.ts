import { NextRequest, NextResponse } from 'next/server';
import { createLeadTask } from '@/lib/crm/createLeadTask';

const API_KEY = 'acb66b54c1b0db79aabc64a9c8e5c9652763a62efea7c246ca96d006b0e28344';

export async function POST(request: NextRequest) {
  if (request.headers.get('x-api-key') !== API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const { leadId, companyId, title, description, dueDate, priority } = body;
    
    if (!title || !dueDate) {
      return NextResponse.json({ error: 'title and dueDate required' }, { status: 400 });
    }
    
    const taskId = await createLeadTask({
      leadId,
      companyId,
      title,
      description,
      dueDate: new Date(dueDate),
      priority: priority || 'medium',
    });
    
    return NextResponse.json({ success: true, taskId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
