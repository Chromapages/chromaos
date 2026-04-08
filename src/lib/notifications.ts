export async function sendDiscordNotification(lead: any) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    const embed = {
      title: "🚀 New Lead Ingested",
      description: `A new lead has been captured for **${lead.brandId || 'ChromaPages'}**`,
      color: 0x00ff99,
      fields: [
        { name: "Name", value: lead.fullName || "N/A", inline: true },
        { name: "Email", value: lead.email || "N/A", inline: true },
        { name: "Company", value: lead.companyName || "N/A", inline: true },
        { name: "Source", value: `${lead.source || 'Web'} - ${lead.sourceDetail || 'General'}`, inline: false },
        { name: "Fit Score", value: `${lead.fitScore || 'N/A'}/10`, inline: true },
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "ChromaOS Ingestion Engine",
      },
    };

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
    });
  } catch (error) {
    console.error("Failed to send Discord notification:", error);
  }
}
