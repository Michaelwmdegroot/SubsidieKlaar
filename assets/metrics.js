/* Optional first-party aggregate counters. Never reads form fields or documents. */
(function () {
  'use strict';
  const key = 'sr.metrics.choice.v1';
  const allowed = new Set(['visit','start','step0','step1','step2','step3','review','download','pdf','zip']);
  const seen = new Set();
  const enabledHost = location.protocol === 'https:' && location.hostname === 'subsidieready.nl';
  const testHost = ['127.0.0.1','localhost'].includes(location.hostname);
  let configured = false;
  let choice = null;
  const blocked = navigator.globalPrivacyControl === true || navigator.doNotTrack === '1';
  try {
    const stored = JSON.parse(localStorage.getItem(key) || 'null');
    if (stored && ['allow','deny'].includes(stored.choice) && stored.until > Date.now()) choice = stored.choice;
  } catch (_) { /* Storage is optional; deny remains the default. */ }
  function record(event, unique = false, demo = false) {
    if (!configured || blocked || choice !== 'allow' || demo || !allowed.has(event)) return;
    if (unique && seen.has(event)) return;
    if (unique) seen.add(event);
    // Exactly one enumerated field. No filenames, identifiers, URLs or input values.
    fetch('/api/event.php', {method:'POST', credentials:'omit', mode:'same-origin',
      headers:{'Content-Type':'application/json'}, body:JSON.stringify({event}),
      referrerPolicy:'no-referrer', keepalive:true}).catch(() => {});
  }
  function status() {
    return !configured ? 'Gebruikstellingen zijn niet geactiveerd.' : blocked ?
      'Je browser vraagt om niet te meten. Dat respecteren we.' : choice === 'allow' ?
      'Optionele gebruikstellingen staan aan. Dossiergegevens worden niet meegestuurd.' :
      'Gebruikstellingen staan uit. De volledige tool blijft beschikbaar.';
  }
  function choose(value) {
    if (!['allow','deny'].includes(value)) return;
    choice = value;
    try { localStorage.setItem(key, JSON.stringify({choice,until:Date.now()+180*86400000})); } catch (_) {}
    document.getElementById('metrics-choice')?.remove();
    document.body.classList.remove('has-metrics-choice');
    for (const el of document.querySelectorAll('[data-metrics-status]')) el.textContent = status();
    if (value === 'deny') seen.clear();
    else record('visit', true);
  }
  function mount() {
    for (const el of document.querySelectorAll('[data-metrics-status]')) el.textContent = status();
    for (const el of document.querySelectorAll('[data-metrics="allow"]')) el.disabled = !configured || blocked;
    if (!configured || blocked || choice !== null || document.getElementById('metrics-choice')) return;
    const box = document.createElement('section');
    box.id = 'metrics-choice'; box.className = 'metrics-choice';
    box.setAttribute('aria-label','Optionele gebruikstellingen');
    box.innerHTML = '<div><strong>Help je de tool verbeteren?</strong><p>Met jouw toestemming tellen we acties zoals starten en downloaden. Geen dossiergegevens. <a href="/privacy/" target="_blank" rel="noopener">Privacyuitleg</a></p></div><div class="button-row"><button class="btn btn-secondary btn-small" data-metrics="deny">Nee, bedankt</button><button class="btn btn-secondary btn-small" data-metrics="allow">Toestaan</button></div>';
    document.body.appendChild(box); document.body.classList.add('has-metrics-choice');
  }
  document.addEventListener('click', e => {
    const button = e.target.closest('[data-metrics]');
    if (button) { e.preventDefault(); choose(button.dataset.metrics); }
  });
  window.SRMetrics = Object.freeze({record,choose,status});
  if ((!enabledHost && !testHost) || document.documentElement.dataset.offline === 'true') return;
  fetch('/api/settings.php',{credentials:'omit',mode:'same-origin',referrerPolicy:'no-referrer',cache:'no-store'})
    .then(r => r.ok ? r.json() : null).then(settings => {
      if (!settings || settings.service !== 'SubsidieReady') return;
      configured = settings.analytics === true;
      // Public operator metadata is rendered as text, never as HTML.
      if (typeof settings.operator === 'string') for (const el of document.querySelectorAll('[data-operator]')) el.textContent = settings.operator;
      if (typeof settings.contact === 'string' && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(settings.contact)) {
        for (const el of document.querySelectorAll('[data-contact]')) {
          el.textContent = settings.contact; el.setAttribute('href','mailto:'+settings.contact);
        }
      }
      mount(); record('visit',true);
    }).catch(() => { mount(); });
})();
