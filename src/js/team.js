/*
 * team.js — gallery interactions
 *   • Card click → hydrate modal from <template> + open popout-frame
 *   • Copy-link button (card + modal + standalone page) → vanity URL
 *   • Search input → live filter on name + title
 *   • ?member=<slug> on load → auto-open that modal
 *   • URL sync: opening modal pushes ?member=<slug>; closing strips it.
 */
(function () {
  'use strict';

  var SITE_ORIGIN = window.location.origin;
  var grid0 = document.getElementById('team-grid');
  var TEAM_BASE = (grid0 && grid0.getAttribute('data-team-base')) || '/team-2026/';

  function vanityUrl(slug) { return SITE_ORIGIN + TEAM_BASE + slug + '/'; }

  function flashCopied(btn) {
    if (!btn) return;
    btn.classList.add('is-copied');
    var prev = btn.getAttribute('aria-label') || '';
    btn.setAttribute('aria-label', 'Link copied');
    setTimeout(function () {
      btn.classList.remove('is-copied');
      if (prev) btn.setAttribute('aria-label', prev);
    }, 1400);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement('textarea');
        ta.value = text; ta.setAttribute('readonly', '');
        ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select(); document.execCommand('copy');
        document.body.removeChild(ta); resolve();
      } catch (e) { reject(e); }
    });
  }

  // ── Modal hydration ───────────────────────────────────────────────
  var modal     = document.getElementById('team-modal');
  var modalBody = document.getElementById('team-modal-body');
  var modalCopy = modal && modal.querySelector('.popout-copy');
  var currentSlug = null;

  function openMember(slug, opts) {
    if (!modal || !modalBody) return;
    var tpl = document.getElementById('tm-' + slug);
    if (!tpl || !tpl.content) return;
    modalBody.innerHTML = '';
    modalBody.appendChild(tpl.content.cloneNode(true));
    currentSlug = slug;
    if (window.PopoutFrame && PopoutFrame.open) {
      PopoutFrame.open('team-modal');
    } else {
      modal.classList.add('active');
    }
    if (!opts || opts.pushUrl !== false) {
      var u = new URL(window.location.href);
      u.searchParams.set('member', slug);
      history.replaceState({}, '', u.toString());
    }
  }

  function closeMember() {
    currentSlug = null;
    var u = new URL(window.location.href);
    if (u.searchParams.has('member')) {
      u.searchParams.delete('member');
      history.replaceState({}, '', u.pathname + (u.search ? u.search : '') + u.hash);
    }
  }

  // popout-frame.js handles closing via .popout-close click + esc; tap into close to clear URL
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeMember(); // backdrop click — popout-frame.js may also close
    });
    var closeBtn = modal.querySelector('.popout-close');
    if (closeBtn) closeBtn.addEventListener('click', closeMember);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeMember();
    });
  }

  // ── Card click + copy-link delegation ─────────────────────────────
  var grid = document.getElementById('team-grid');
  if (grid) {
    grid.addEventListener('click', function (e) {
      var copyBtn = e.target.closest && e.target.closest('.team-card-link');
      if (copyBtn) {
        e.preventDefault();
        e.stopPropagation();
        var slug = copyBtn.getAttribute('data-slug');
        copyText(vanityUrl(slug)).then(function () { flashCopied(copyBtn); });
        return;
      }
      var trigger = e.target.closest && e.target.closest('.team-card-trigger');
      if (trigger) {
        var memSlug = trigger.getAttribute('data-member');
        if (memSlug) openMember(memSlug);
      }
    });
  }

  // Modal copy button
  if (modalCopy) {
    modalCopy.addEventListener('click', function () {
      if (!currentSlug) return;
      copyText(vanityUrl(currentSlug)).then(function () { flashCopied(modalCopy); });
    });
  }

  // Standalone page copy button (any element with data-copy-url)
  document.querySelectorAll('[data-copy-url]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      copyText(btn.getAttribute('data-copy-url')).then(function () { flashCopied(btn); });
    });
  });

  // ── Search filter ─────────────────────────────────────────────────
  var input = document.getElementById('team-search-input');
  var emptyMsg = document.getElementById('team-empty');
  if (input && grid) {
    input.addEventListener('input', function () {
      var q = (input.value || '').trim().toLowerCase();
      var anyVisible = false;
      var cards = grid.querySelectorAll('.team-card');
      cards.forEach(function (c) {
        var hay = c.getAttribute('data-search') || '';
        var match = !q || hay.indexOf(q) !== -1;
        c.hidden = !match;
        if (match) anyVisible = true;
      });
      if (emptyMsg) emptyMsg.hidden = anyVisible;
    });
  }

  // ── ?member= deep-link on load ────────────────────────────────────
  var initial = new URLSearchParams(window.location.search).get('member');
  if (initial) {
    // Defer to ensure templates are parsed
    setTimeout(function () { openMember(initial, { pushUrl: false }); }, 0);
  }
})();
