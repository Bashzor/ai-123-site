export async function onRequest(context) {
  const { request } = context;

  // CORS preflight support
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders()
    });
  }

  if (request.method !== "POST") {
    return Response.json({ ok: false, error: "Method not allowed" }, { status: 405, headers: corsHeaders() });
  }

  try {
    const data = await request.json().catch(() => ({}));
    const name = (data.name || "").toString().trim();
    const email = (data.email || "").toString().trim();
    const business = (data.business || "").toString().trim();
    const message = (data.message || "").toString().trim();

    if (!name || !email || !message) {
      return Response.json(
        { ok: false, error: "Missing required fields: name, email, message." },
        { status: 400, headers: corsHeaders() }
      );
    }

    const payload = {
      personalizations: [{ to: [{ email: "admin@ai-123.net" }] }],
      from: { email: "admin@ai-123.net", name: "AI-123 Website" },
      reply_to: { email, name },
      subject: `AI-123 Consult Request — ${business || "New lead"}`,
      content: [
        {
          type: "text/plain",
          value:
`Name: ${name}
Email: ${email}
Business: ${business || ""}

Message:
${message}
`
        }
      ]
    };

    const resp = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });

    const detail = await resp.text().catch(() => "");
    if (!resp.ok) {
      return Response.json(
        { ok: false, error: "Email send failed", detail },
        { status: 502, headers: corsHeaders() }
      );
    }

    return Response.json({ ok: true }, { status: 200, headers: corsHeaders() });
  } catch (err) {
    return Response.json(
      { ok: false, error: err?.message || "Server error" },
      { status: 500, headers: corsHeaders() }
    );
  }
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

