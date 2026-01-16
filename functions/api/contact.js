document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  if (!form) {
    console.error("Contact form not found");
    return;
  }

  console.log("Contact form loaded");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Form submit triggered");

    status.textContent = "Sending…";
    status.style.color = "inherit";

    const fd = new FormData(form);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      business: fd.get("business"),
      message: fd.get("message")
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const out = await res.json().catch(() => ({}));
      console.log("API response:", res.status, out);

      if (!res.ok || !out.ok) {
        throw new Error(out.error || "Send failed");
      }

      status.textContent = "Thanks! We received your request.";
      status.style.color = "green";
      form.reset();
    } catch (err) {
      console.error("Submit error:", err);
      status.textContent = "There was an error sending your message.";
      status.style.color = "crimson";
    }
  });
});


