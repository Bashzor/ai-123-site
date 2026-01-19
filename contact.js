document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const statusEl = document.getElementById("contactStatus");

  if (!form) {
    console.error("contactForm not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    statusEl.textContent = "Sending…";

    const trainingTools = Array.from(
      document.querySelectorAll('input[name="trainingTools"]:checked')
    ).map(el => el.value);

    const payload = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      company: document.getElementById("company").value.trim(),
      employees: document.getElementById("employees").value || "",
      message: document.getElementById("message").value.trim(),
      trainingTools
    };

    try {
      const res = await fetch("/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Send failed");
      }

      statusEl.textContent = "Message sent successfully.";
      form.reset();
    } catch (err) {
      console.error(err);
      statusEl.textContent = "Error sending message.";
    }
  });
});


