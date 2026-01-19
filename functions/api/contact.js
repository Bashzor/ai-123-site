export async function onRequest({ request }) {
  // CORS
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, error: "Method not allowed", method: request.method }), {
      status: 405,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "content-type": "application/json"
      }
    });
  }

  // Echo back what we received
  const body = await request.json().catch(() => ({}));
  return new Response(JSON.stringify({ ok: true, received: body }), {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "content-type": "application/json"
    }
  });
}

