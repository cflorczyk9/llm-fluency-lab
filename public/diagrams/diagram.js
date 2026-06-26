/* Shared diagram helper for LLM Fluency Lab.

   Exposes window.reportDiagramHeight(): measures the document and posts
   { type: 'lfl-diagram-height', key, height } to the embedding parent so the
   host iframe can size itself to the content (no internal scrollbars).

   The key is read from <html data-diagram-key="..."> when present, otherwise
   inferred from the filename (architecture.html -> "architecture"). Each
   diagram file is named after its module key, so this matches the host's
   per-row filter.

   Auto-reports on DOM ready, on full load, and whenever the document resizes.
   No framework, no network calls. */
(function () {
  'use strict';

  function diagramKey() {
    var attr = document.documentElement.getAttribute('data-diagram-key');
    if (attr) return attr;
    var path = (location.pathname || '').replace(/\/+$/, '');
    var m = path.match(/\/?([^\/]+?)(?:\.html?)?$/i);
    return m ? m[1] : '';
  }

  var KEY = diagramKey();
  var lastSent = -1;

  function report() {
    var doc = document.documentElement;
    var height = Math.max(
      doc.scrollHeight,
      document.body ? document.body.scrollHeight : 0,
    );
    height = Math.ceil(height);
    if (!height || height === lastSent) return;
    lastSent = height;
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(
          { type: 'lfl-diagram-height', key: KEY, height: height },
          '*',
        );
      }
    } catch (e) {
      /* cross-origin parent or no parent: nothing to do */
    }
  }

  // Public API
  window.reportDiagramHeight = report;

  // Auto-report at the key lifecycle moments.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', report);
  } else {
    report();
  }
  window.addEventListener('load', function () {
    // a couple of follow-ups catch late layout (fonts, async reveals)
    report();
    setTimeout(report, 60);
    setTimeout(report, 300);
  });

  // Re-report on any size change, throttled to one per animation frame.
  var pending = false;
  function schedule() {
    if (pending) return;
    pending = true;
    (window.requestAnimationFrame || window.setTimeout)(function () {
      pending = false;
      report();
    });
  }
  window.addEventListener('resize', schedule);
  if (typeof ResizeObserver !== 'undefined') {
    try {
      new ResizeObserver(schedule).observe(document.documentElement);
    } catch (e) {
      /* ignore */
    }
  }
})();
