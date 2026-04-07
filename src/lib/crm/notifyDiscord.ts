/**
 * Posts a lead creation notification to Discord via webhook.
 * Call this after saving a lead to Firestore.
 */

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/1490948196501950514/_GYZiJ_ZaMsVwIjgG8UUI-IPIcJRxg_hwCsko8kIKEVd23ABPKaxrYAla6X7xLbGnnXt';

interface LeadNotifyParams {
  leadId: string;
  companyName?: string;
  fullName?: string;
  tradeOrVertical?: string;
  source?: string;
  email?: string;
  phone?: string;
  chromaosUrl?: string;
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
    chromaosUrl = `https://chromaos.vercel.app/leads/${leadId}`,
  } = params;

  if (!DISCORD_WEBHOOK_URL) {
    console.warn('DISCORD_WEBHOOK_URL not set — skipping Discord notification');
    return;
  }

  const fields = [
    { name: 'Company', value: companyName, inline: true },
    { name: 'Contact', value: fullName, inline: true },
    { name: 'Trade', value: tradeOrVertical, inline: true },
    { name: 'Source', value: source, inline: true },
  ];

  if (email) {
    fields.push({ name: 'Email', value: email, inline: true });
  }
  if (phone) {
    fields.push({ name: 'Phone', value: phone, inline: true });
  }

  const body = {
    content: `🆕 **New Lead Added**`,
    embeds: [
      {
        title: companyName,
        url: chromaosUrl,
        fields,
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
