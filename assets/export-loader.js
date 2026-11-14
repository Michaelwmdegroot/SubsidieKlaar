(function () {
  'use strict';
  // Fixed local dependencies only. Visiting, editing, printing and JSON export load none.
  const files = Object.freeze({
    pdf: {src: '/vendor/pdf-lib-1.17.1.min.js', ready: () => !!window.PDFLib},
    font: {src: '/vendor/fontkit-1.1.1.min.js', ready: () => !!window.fontkit},
    glyphs: {src: '/vendor/noto-sans-font.js', ready: () => !!window.SK_FONT_BASE64},
    zip: {src: '/vendor/jszip-3.10.1.min.js', ready: () => !!window.JSZip}
  });
  const pending = new Map();
  function load(key) {
    const file = files[key];
    if (file.ready()) return Promise.resolve();
    if (pending.has(key)) return pending.get(key);
    // Portable HTML bundles the dependencies. Never fetch from a file/about:blank preview.
    if (document.documentElement.dataset.offline === 'true') {
      return Promise.reject(new Error('Dit offline bestand mist een exportonderdeel. Download een nieuwe versie. Je gegevens blijven behouden.'));
    }
    const promise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      let timer;
      const finish = ok => {
        clearTimeout(timer);
        script.onload = script.onerror = null;
        if (ok) resolve();
        else {
          script.remove();
          reject(new Error('Het downloadonderdeel kon niet worden geladen. Controleer je verbinding en probeer opnieuw. Je gegevens blijven behouden.'));
        }
      };
      script.src = file.src;
      script.async = true;
      script.onload = () => finish(file.ready());
      script.onerror = () => finish(false);
      timer = setTimeout(() => finish(false), 15000);
      document.head.appendChild(script);
    });
    pending.set(key, promise);
    promise.catch(() => { if (pending.get(key) === promise) pending.delete(key); });
    return promise;
  }
  function ensure(kind) {
    if (!['pdf', 'zip'].includes(kind)) return Promise.reject(new Error('Onbekende downloadsoort.'));
    return Promise.all((kind === 'zip' ? ['pdf', 'font', 'glyphs', 'zip'] : ['pdf', 'font', 'glyphs']).map(load));
  }
  window.SRExportLoader = Object.freeze({ensure});
})();
