// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: cors()
  });
}

// Handle POST /api/contact
export async function onRequestPost({ request }) {
  try {
    const data = await request.json().catch(() => ({}));

    const name = (data.name || "").toString().trim();
    const email = (data.email || "").toString().trim();
    const business = (data.business || "").toString().trim();
    const message = (data.message || "").toString().trim();

    // NEW fields
    const employeesRaw = data.employees;
    const employees =
      employeesRaw === null || employeesRaw === undefined || employeesRaw === ""
        ? ""
        : Number(employeesRaw);

    const trainingToolsRaw = Array.isArray(data.trainingTools) ? data.trainingTools : [];
    const trainingTools = trainingToolsRaw
      .map((x) => (x || "").toString().trim())
      .filter(Boolean)
      .slice(0, 25); // safety cap

    // Required fields
    if (!name || !email || !message) {
      return Response.json(
        { ok: false, error: "Missing required fields" },
        { status: 400, headers: cors() }
      );
    }

    // Validate employees (optional)
    if (employees !== "" && (!Number.isFinite(employees) || employees < 1 || employees > 1000000)) {
      return Response.json(
        { ok: false, error: "Employees must be a valid number" },
        { status: 400, headers: cors() }
      );
    }

    const payload = {
      personalizations: [{ to: [{ email: "admin@ai-123.net" }] }],
      from: { email: "no-reply@ai-123.net", name: "AI-123 Website" },
      reply_to: { email, name },
      subject: `AI-123 Consult Request — ${business || "New lead"}`,
      content: [
        {
          type: "text/plain",
          value:
`Name: ${name}
Email: ${email}
Business: ${business || "(not provided)"}
Employees: ${employees === "" ? "(not provided)" : employees}
Training tools: ${trainingTools.length ? trainingTools.join(", ") : "(none selected)"}

Message:
${message}`
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
        { status: 502, headers: cors() }
      );
    }

    return Response.json({ ok: true }, { status: 200, headers: cors() });
  } catch (err) {
    return Response.json(
      { ok: false, error: err?.message || "Server error" },
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

