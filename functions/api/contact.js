export async function onRequest(context) {
  const { request } = context;

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: cors()
    });
  }

  // Only allow POST
  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ ok: false, error: "Method not allowed" }),
      { status: 405, headers: cors() }
    );
  }

  try {
    const { name, email, business, message } = await request.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing required fields" }),
        { status: 400, headers: cors() }
      );
    }

    const payload = {
      personalizations: [
        { to: [{ email: "admin@ai-123.net" }] }
      ],
      from: {
        email: "admin@ai-123.net",
        name: "AI-123 Website"
      },
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
${message}`
        }
      ]
    };

    const resp = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const detail = await resp.text();
      return new Response(
        JSON.stringify({ ok: false, error: "Email send failed", detail }),
        { status: 502, headers: cors() }
      );
    }

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: cors() }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: err.message || "Server error" }),
      { status: 500, headers: cors() }
    );
  }
}

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}


