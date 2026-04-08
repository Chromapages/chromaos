import { NextRequest, NextResponse } from 'next/server';
import { getChromaContext } from '@/lib/crm/chromaContext';

const API_KEY = 'acb66b54c1b0db79aabc64a9c8e5c9652763a62efea7c246ca96d006b0e28344';

export async function GET(request: NextRequest) {
  if (request.headers.get('x-api-key') !== API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const context = await getChromaContext();
    return NextResponse.json(context);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
