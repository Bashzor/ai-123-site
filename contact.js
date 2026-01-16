document.addEventListener('DOMContentLoaded', function(){
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  if(!form) return;

  function setStatus(msg, type){
    statusEl.textContent = msg;
    statusEl.className = 'form-status ' + (type || '');
  }

  function validate(fields){
    if(!fields.name || fields.name.trim().length < 2) return 'Please enter your full name.';
    if(!fields.email || !/^\S+@\S+\.\S+$/.test(fields.email)) return 'Please enter a valid email.';
    if(!fields.message || fields.message.trim().length < 10) return 'Tell us a bit more so we can help.';
    return null;
  }

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    setStatus('');

    const data = {
      name: form.name.value || '',
      email: form.email.value || '',
      business: form.business.value || '',
      message: form.message.value || ''
    };

    const err = validate(data);
    if(err){
      setStatus(err, 'error');
      return;
    }

    // UI: disable while "sending"
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    setStatus('Sending your request…');

    try {
      const res = await fetch('https://ai-123-site.steep-art-b98a.workers.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const out = await res.json().catch(() => ({}));

      if (!res.ok || !out.ok) {
        throw new Error(out.error || out.detail || 'Send failed');
      }

      setStatus('Thanks! We received your request and will reply within 1 business day.', 'success');
      form.reset();
    } catch (err2) {
      console.error(err2);
      setStatus('There was an error sending your message. Try again later.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
});

