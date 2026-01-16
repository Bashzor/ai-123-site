export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const { name, email, business, message } = await request.json();

    if (!name || !email || !message) {
      return Response.json({ ok: false, error: "Missing required fields." }, { status: 400 });
    }

    // Send email via MailChannels (Cloudflare-supported)
  const payload = {
  personalizations: [{ to: [{ email: "admin@ai-123.net" }] }],
  from: { email: "admin@ai-123.net", name: "AI-123 Website" },
  reply_to: { email, name },
  subject: `AI-123 Consult Request — ${business || "New lead"}`,
  content: [{
    type: "text/plain",
    value:
`Name: ${name}
Email: ${email}
Business: ${business || ""}

Message:
${message}
`
  }]
};


    const resp = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const detail = await resp.text().catch(() => "");
      return Response.json({ ok: false, error: "Email send failed", detail }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: err?.message || "Server error" }, { status: 500 });
  }
}
