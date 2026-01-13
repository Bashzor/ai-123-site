// Minimal client-side behavior for ai-123-site

document.addEventListener('DOMContentLoaded', () => {
  // Insert current year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Contact form handling
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = '';

      const formData = new FormData(form);
      const name = (formData.get('name') || '').toString().trim();
      const email = (formData.get('email') || '').toString().trim();
      const message = (formData.get('message') || '').toString().trim();

      if (!name || !email || !message) {
        status.textContent = 'Please fill in all fields.';
        status.style.color = 'crimson';
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        status.textContent = 'Please enter a valid email address.';
        status.style.color = 'crimson';
        return;
      }

      // Show sending state
      status.textContent = 'Sending…';
      status.style.color = '';

      try {
        // Placeholder: replace with a real endpoint if/when available
        // Example:
        // await fetch('/api/contact', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ name, email, message })
        // });

        // Simulate network latency for demo purposes
        await new Promise((r) => setTimeout(r, 700));

        status.textContent = 'Thanks! Your message has been received.';
        status.style.color = 'green';
        form.reset();
      } catch (err) {
        console.error(err);
        status.textContent = 'There was an error sending your message. Try again later.';
        status.style.color = 'crimson';
      }
    });
  }
});
