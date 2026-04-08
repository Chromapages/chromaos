import { NextRequest, NextResponse } from 'next/server';

const CHROMA_GATEWAY_URL = process.env.CHROMA_GATEWAY_URL || 'http://localhost:18789';
const CHROMA_API_KEY = process.env.CHROMA_API_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lead } = body;

    if (!lead) {
      return NextResponse.json({ error: 'lead object required' }, { status: 400 });
    }

    // Forward to Chroma's gateway
    const chromaRes = await fetch(`${CHROMA_GATEWAY_URL}/api/internal/lead-event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CHROMA_API_KEY,
      },
      body: JSON.stringify({
        event: 'lead_created',
        lead,
        source: 'chromaos',
        timestamp: new Date().toISOString(),
      }),
    });

    if (!chromaRes.ok) {
      console.warn('Chroma gateway notification failed:', chromaRes.status);
      // Don't fail the lead creation — log but continue
    }

    return NextResponse.json({ success: true, forwarded: true });
  } catch (error: any) {
    console.error('inbound-lead error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}