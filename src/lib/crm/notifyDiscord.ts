/**
 * Posts a lead creation notification to Discord via webhook.
 * Format: [lead:json] — parsed by Chroma's standing order in #chroma.
 */

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/1490948196501950514/_GYZiJ_ZaMsVwIjgG8UUI-IPIcJRxg_hwCsko8kIKEVd23ABPKaxrYAla6X7xLbGnnXt';
const CHROMAOS_URL = process.env.CHROMAOS_URL || 'https://chromaos.vercel.app';

interface LeadNotifyParams {
  leadId: string;
  companyName?: string;
  fullName?: string;
  tradeOrVertical?: string;
  source?: string;
  email?: string;
  phone?: string;
  website?: string;
  budgetRange?: string;
  timeline?: string;
  offerInterest?: string;
  notesSummary?: string;
}

export async function notifyDiscordOfLead(params: LeadNotifyParams): Promise<void> {
  const {
    leadId,
    companyName = 'Unknown',
    fullName = 'Unknown',
    tradeOrVertical = 'N/A',
    source = 'N/A',
    email,
    phone,
    website,
    budgetRange,
    timeline,
    offerInterest,
    notesSummary,
  } = params;

  if (!DISCORD_WEBHOOK_URL) {
    console.warn('DISCORD_WEBHOOK_URL not set — skipping Discord notification');
    return;
  }

  // Structured lead payload — Chroma parses this from [lead:...] messages
  const leadPayload = {
    leadId,
    companyName,
    fullName,
    tradeOrVertical,
    source,
    email: email || null,
    phone: phone || null,
    website: website || null,
    budgetRange: budgetRange || null,
    timeline: timeline || null,
    offerInterest: offerInterest || null,
    notesSummary: notesSummary || null,
    chromaosUrl: `${CHROMAOS_URL}/leads/${leadId}`,
  };

  const triggerLine = `[lead:]\n\`\`\`json\n${JSON.stringify(leadPayload, null, 2)}\n\`\`\``;

  const body = {
    content: `🆕 **New Lead** — ${companyName}\n${triggerLine}`,
    embeds: [
      {
        title: companyName,
        url: `${CHROMAOS_URL}/leads/${leadId}`,
        fields: [
          { name: 'Contact', value: fullName, inline: true },
          { name: 'Trade', value: tradeOrVertical, inline: true },
          { name: 'Source', value: source, inline: true },
          ...(email ? [{ name: 'Email', value: email, inline: true }] : []),
          ...(phone ? [{ name: 'Phone', value: phone, inline: true }] : []),
        ],
        footer: { text: `Lead ID: ${leadId} · ChromaOS` },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  const res = await fetch(DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error('Discord webhook failed:', res.status, await res.text());
  }
}
