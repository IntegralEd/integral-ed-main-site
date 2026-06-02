/* =============================================================================
 * 15th Anniversary — soft preview password gate
 * -----------------------------------------------------------------------------
 * NOTE: This is light-touch protection for a private preview, not real security.
 * The page content still ships in the response; this only deters casual access
 * and keeps the link from being browsable without the password. For anything
 * truly sensitive, use server-side / Netlify-level protection instead.
 *
 * To change the password: compute the SHA-256 hash of the new password
 *   printf '%s' 'yourpassword' | shasum -a 256
 * and replace HASH below. (Current password: "@nniversary")
 * ============================================================================= */
(function () {
  'use strict';
  var HASH = '1054adf741625093e2c936f8b79097db7ee285e855d1fddf2d270b706150e5e9';
  var KEY  = 'anniv-unlocked';

  function unlock() {
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
    document.documentElement.classList.remove('anniv-locked');
    var g = document.getElementById('anniv-gate');
    if (g) g.setAttribute('hidden', '');
  }

  function sha256Hex(str) {
    if (!(window.crypto && window.crypto.subtle)) return Promise.reject('no-subtle');
    return window.crypto.subtle
      .digest('SHA-256', new TextEncoder().encode(str))
      .then(function (buf) {
        return Array.prototype.map
          .call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); })
          .join('');
      });
  }

  function init() {
    try { if (sessionStorage.getItem(KEY) === '1') { unlock(); return; } } catch (e) {}

    var form  = document.getElementById('anniv-gate-form');
    var input = document.getElementById('anniv-gate-input');
    var err   = document.getElementById('anniv-gate-err');
    if (!form || !input) return;

    function fail() { if (err) err.hidden = false; input.value = ''; input.focus(); }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (err) err.hidden = true;
      sha256Hex(input.value || '').then(function (h) {
        if (h === HASH) unlock();
        else fail();
      }).catch(function () { fail(); });
    });

    input.focus();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
