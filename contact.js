document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const statusEl = document.getElementById("contactStatus");

  if (!form) {
    console.error("contactForm not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    statusEl.textContent = "Sending…";

    const trainingTools = Array.from(
      document.querySelectorAll('input[name="trainingTools"]:checked')
    ).map((el) => el.value);

    const payload = {
      name: (document.getElementById("name")?.value || "").trim(),
      email: (document.getElementById("email")?.value || "").trim(),
      company: (document.getElementById("company")?.value || "").trim(),
      employees: (document.getElementById("employees")?.value || "").trim(),
      message: (document.getElementById("message")?.value || "").trim(),
      trainingTools
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const text = await res.text().catch(() => "");
      let data = null;
      try { data = JSON.parse(text); } catch {}

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || text || `HTTP ${res.status}`);
      }

      statusEl.textContent = "Sent! We’ll get back to you soon.";
      form.reset();
    } catch (err) {
      console.error(err);
      statusEl.textContent = `Error: ${err.message}`;
    }
  });
});
