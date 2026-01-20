export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: cors()
  });
}

export async function onRequestPost({ request }) {
  try {
    const data = await request.json().catch(() => ({}));

    return new Response(JSON.stringify({
      ok: true,
      received: data
    }), {
      status: 200,
      headers: {
        ...cors(),
        "Content-Type": "application/json"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      ok: false,
      error: err.message
    }), {
      status: 500,
      headers: cors()
    });
  }
}

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
