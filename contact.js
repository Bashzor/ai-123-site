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

  form.addEventListener('submit', function(e){
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

    // NOTE: Replace this simulated request with a real endpoint or form handler.
    // For now we simulate network latency and show success to the user.
    setTimeout(function(){
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      setStatus('Thanks! We received your request and will reply within 1 business day.', 'success');
      form.reset();

      // Optionally, you can forward to a real API endpoint here using fetch()
      // fetch('/api/contact', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) })
      //  .then(r=>r.json()).then(...)
    }, 1100);
  });
});
