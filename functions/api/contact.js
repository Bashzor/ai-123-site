// CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: cors()
  });
}

// POST handler (this is the important part)
export async function onRequestPost({ request }) {
  try {
    const data = await request.json().catch(() => ({}));
    const name = (data.name || "").toString().trim();
    const email = (data.email || "").toString().trim();
    const business = (data.business || "").toString().trim();
    const message = (data.message || "").toString().trim();

    if (!name || !email || !message) {
      return Response.json(
        { ok: false, error: "Missing required fields: name, email, message." },
        { status: 400, headers: cors() }
      );
    }

    const payload = {
      personalizations: [{ to: [{ email: "admin@ai-123.net" }] }],
      // Use a safer sender to reduce MailChannels rejection:
      from: { email: "no-reply@ai-123.net", name: "AI-123 Website"



