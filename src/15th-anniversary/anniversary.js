/* =============================================================================
 * 15th Anniversary page — rendering + interactions
 * Reads window.ANNIVERSARY_DATA (see data/anniversary-data.js) and renders each
 * section. Also wires scroll-spy left-nav, reveal-on-scroll, and counters.
 * Renders gracefully when data is empty (shows a "to be filled in" hint).
 * ========================================================================== */
(function () {
  'use strict';

  var D = window.ANNIVERSARY_DATA || {};
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var empty = function (label) {
    return '<div class="anniv-empty">' + esc(label) + ' will appear here once added to ' +
      '<code>data/anniversary-data.js</code>.</div>';
  };

  /* ── Hero meta + counters ─────────────────────────────────────────────── */
  function renderHero() {
    var m = D.meta || {};
    if (m.eyebrow && $('anniv-eyebrow')) $('anniv-eyebrow').textContent = m.eyebrow;
    if (m.headline && $('anniv-hero-h')) $('anniv-hero-h').textContent = m.headline;
    if (m.subhead && $('anniv-hero-sub')) $('anniv-hero-sub').textContent = m.subhead;

    var wrap = $('anniv-counters');
    if (!wrap) return;
    var counters = (m.counters || []).filter(function (c) { return c && c.label; });
    wrap.innerHTML = counters.map(function (c) {
      return '<div class="anniv-counter reveal">' +
        '<span class="anniv-counter-num" data-target="' + Number(c.value || 0) + '" ' +
        'data-suffix="' + esc(c.suffix || '') + '">0</span>' +
        '<span class="anniv-counter-label">' + esc(c.label) + '</span>' +
        '</div>';
    }).join('');
  }

  /* ── Timeline ─────────────────────────────────────────────────────────── */
  function renderTimeline() {
    var el = $('anniv-timeline');
    if (!el) return;
    var items = (D.timeline || []).filter(function (t) { return t && (t.year || t.title); });
    if (!items.length) { el.innerHTML = empty('Timeline milestones'); return; }
    el.innerHTML = items.map(function (t) {
      return '<li class="anniv-tl-item reveal">' +
        '<span class="anniv-tl-dot"></span>' +
        '<span class="anniv-tl-year">' + esc(t.year || '') + '</span>' +
        (t.tag ? '<span class="anniv-tl-tag">' + esc(t.tag) + '</span>' : '') +
        (t.title ? '<h3 class="anniv-tl-title">' + esc(t.title) + '</h3>' : '') +
        (t.body ? '<p class="anniv-tl-body">' + esc(t.body) + '</p>' : '') +
        (t.image ? '<img class="anniv-tl-img" src="' + esc(t.image) + '" alt="' + esc(t.title || '') + '" loading="lazy">' : '') +
        '</li>';
    }).join('');
  }

  /* ── Evolution (additive stacked bars) ───────────────────────────────── */
  function renderEvolution() {
    var el = $('anniv-evolution');
    if (!el) return;
    var stages = (D.evolution || []).filter(function (s) { return s && s.stage; });
    if (!stages.length) { el.innerHTML = empty('Evolution stages'); return; }
    var n = stages.length;
    el.innerHTML = stages.map(function (s, i) {
      var w = Math.round(((i + 1) / n) * 100); // additive: each layer extends further
      var color = 'evo-' + (s.color || 'plum');
      return '<div class="anniv-evo-row reveal ' + color + '" style="--w:' + w + '%">' +
        '<div class="anniv-evo-top">' +
          '<span class="anniv-evo-year">' + esc(s.year != null ? s.year : '·') + '</span>' +
          '<span class="anniv-evo-stage">' + esc(s.stage) + '</span>' +
          (s.tagline ? '<span class="anniv-evo-tagline">' + esc(s.tagline) + '</span>' : '') +
        '</div>' +
        (s.whatWeCouldDo ? '<p class="anniv-evo-what">' + esc(s.whatWeCouldDo) + '</p>' : '') +
        '<div class="anniv-evo-bar"><i></i></div>' +
        (s.proof ? '<div class="anniv-evo-proof">' + esc(s.proof) + '</div>' : '') +
        '</div>';
    }).join('');
  }

  /* ── Projects ─────────────────────────────────────────────────────────── */
  function renderProjects() {
    var el = $('anniv-projects');
    if (!el) return;
    var items = (D.projects || []).filter(function (p) { return p && p.title; });
    if (!items.length) { el.innerHTML = empty('Projects'); return; }
    el.innerHTML = items.map(function (p) {
      var media = '';
      if (p.embedUrl) media = '<div class="anniv-project-media"><iframe src="' + esc(p.embedUrl) + '" title="' + esc(p.title) + '" loading="lazy" allowfullscreen></iframe></div>';
      else if (p.image) media = '<div class="anniv-project-media"><img src="' + esc(p.image) + '" alt="' + esc(p.title) + '" loading="lazy"></div>';
      var metaBits = [p.year, p.serviceArea, p.client].filter(Boolean).map(esc).join(' · ');
      var links = [];
      if (p.videoUrl) links.push('<a class="anniv-project-link" href="' + esc(p.videoUrl) + '" target="_blank" rel="noopener">Watch the video →</a>');
      if (p.link)     links.push('<a class="anniv-project-link" href="' + esc(p.link) + '">Learn more →</a>');
      return '<article class="anniv-project reveal">' + media +
        '<div class="anniv-project-body">' +
          (metaBits ? '<div class="anniv-project-meta">' + metaBits + '</div>' : '') +
          '<h3 class="anniv-project-title">' + esc(p.title) + '</h3>' +
          (p.summary ? '<p class="anniv-project-summary">' + esc(p.summary) + '</p>' : '') +
          (links.length ? '<div class="anniv-project-links">' + links.join('') + '</div>' : '') +
        '</div></article>';
    }).join('');
  }

  /* ── Tenure chart ─────────────────────────────────────────────────────── */
  function renderTenure() {
    var el = $('anniv-tenure');
    if (!el) return;
    var rows = ((D.team && D.team.headcountByYear) || []).filter(function (r) { return r && r.year != null; });
    if (!rows.length) { el.innerHTML = empty('Team headcount trend'); return; }
    var max = rows.reduce(function (m, r) { return Math.max(m, Number(r.total || 0)); }, 1);
    el.innerHTML = rows.map(function (r) {
      var w = Math.round((Number(r.total || 0) / max) * 100);
      return '<div class="anniv-tenure-row reveal" style="--w:' + w + '%">' +
        '<span class="anniv-tenure-year">' + esc(r.year) + '</span>' +
        '<div class="anniv-tenure-bar"><i></i></div>' +
        '<span class="anniv-tenure-val">' + esc(r.total != null ? r.total : '') + '</span>' +
        '</div>';
    }).join('');
  }

  /* ── Team members ─────────────────────────────────────────────────────── */
  function initials(name) {
    return String(name || '').trim().split(/\s+/).slice(0, 2)
      .map(function (w) { return w.charAt(0).toUpperCase(); }).join('');
  }
  function renderTeam() {
    var el = $('anniv-team');
    if (!el) return;
    var members = ((D.team && D.team.members) || []).filter(function (m) { return m && m.name; });
    if (!members.length) { el.innerHTML = empty('Teammate photos'); return; }
    var anchorYear = (D.meta && D.meta.anniversaryYear) || new Date().getFullYear();
    el.innerHTML = members.map(function (m, i) {
      var yrs = m.since ? (anchorYear - Number(m.since)) : null;
      var badge = (yrs != null && yrs >= 0)
        ? '<span class="anniv-member-badge">' + (yrs === 0 ? 'NEW' : yrs + (yrs === 1 ? ' yr' : ' yrs')) + '</span>'
        : '';
      var photo = m.image
        ? '<img class="anniv-member-photo" src="' + esc(m.image) + '" alt="' + esc(m.name) + '" loading="lazy">'
        : '<span class="anniv-member-initials" aria-hidden="true">' + esc(initials(m.name)) + '</span>';
      var inner =
        '<div class="anniv-member-frame">' + photo + badge +
          '<span class="anniv-member-cta">View profile →</span>' +
        '</div>' +
        '<div class="anniv-member-info">' +
          '<span class="anniv-member-name">' + esc(m.name) + '</span>' +
          (m.role ? '<span class="anniv-member-role">' + esc(m.role) + '</span>' : '') +
        '</div>';
      var hasLink = m.href && m.href !== '/team/';
      var cls = 'anniv-member reveal' + (m.image ? '' : ' anniv-member--noimg');
      return hasLink
        ? '<a class="' + cls + '" href="' + esc(m.href) + '" style="--d:' + (i * 30) + 'ms">' + inner + '</a>'
        : '<div class="' + cls + '" style="--d:' + (i * 30) + 'ms">' + inner + '</div>';
    }).join('');
  }

  /* ── Clients ──────────────────────────────────────────────────────────── */
  function renderClients() {
    var c = D.clients || {};
    var feat = $('anniv-clients-featured');
    if (feat) {
      var fs = (c.featured || []).filter(function (f) { return f && (f.name || f.logo); });
      feat.innerHTML = fs.map(function (f) {
        return '<div class="anniv-client-card reveal">' +
          (f.logo ? '<img class="anniv-client-logo" src="' + esc(f.logo) + '" alt="' + esc(f.name || '') + '" loading="lazy">' : '') +
          (f.story ? '<p class="anniv-client-story">' + esc(f.story) + '</p>' : '') +
          (f.quote ? '<blockquote class="anniv-client-quote">' + esc(f.quote) +
            (f.quoteAttribution ? '<cite>' + esc(f.quoteAttribution) + '</cite>' : '') +
            '</blockquote>' : '') +
          '</div>';
      }).join('');
    }
    var wall = $('anniv-logos');
    if (wall) {
      var logos = (c.logos || []).filter(function (l) { return l && l.logo; });
      wall.innerHTML = logos.length
        ? logos.map(function (l) { return '<img src="' + esc(l.logo) + '" alt="' + esc(l.name || '') + '" loading="lazy">'; }).join('')
        : empty('Client logos');
    }
  }

  /* ── Service areas (rail + Today section) ─────────────────────────────── */
  function renderServices() {
    var areas = (D.serviceAreas || []).filter(function (s) { return s && s.name; });
    var rail = $('anniv-rail-services');
    if (rail) {
      rail.innerHTML = areas.map(function (s) {
        return '<li><a href="' + esc(s.href || '#') + '">' + esc(s.name) + '</a></li>';
      }).join('');
    }
    var grid = $('anniv-services');
    if (grid) {
      grid.innerHTML = areas.map(function (s) {
        return '<a class="anniv-service reveal" href="' + esc(s.href || '#') + '">' +
          '<span class="anniv-service-name">' + esc(s.name) + '</span> ' +
          '<span class="anniv-service-arrow">→</span></a>';
      }).join('');
    }
  }

  /* ── Counter animation ────────────────────────────────────────────────── */
  function animateCounter(el) {
    var target = Number(el.getAttribute('data-target') || 0);
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1600, start = null;
    function tick(ts) {
      if (start == null) start = ts;
      var t = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(eased * target).toLocaleString() + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ── Observers: reveal + bars + counters ──────────────────────────────── */
  function setupObservers() {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var revealEls = document.querySelectorAll('.reveal, .anniv-evo-row, .anniv-tenure-row');
    var counters = document.querySelectorAll('.anniv-counter-num');

    if (!('IntersectionObserver' in window) || reduce) {
      revealEls.forEach(function (e) { e.classList.add('is-visible'); });
      counters.forEach(function (c) { animateCounter(c); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    revealEls.forEach(function (e) { io.observe(e); });

    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCounter(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ── Scroll-spy left-nav ──────────────────────────────────────────────── */
  function setupScrollSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.anniv-rail-nav a'));
    if (!links.length || !('IntersectionObserver' in window)) return;
    var sections = links.map(function (a) {
      var id = a.getAttribute('href').slice(1);
      return document.getElementById(id);
    }).filter(Boolean);

    function setActive(id) {
      links.forEach(function (a) {
        var li = a.parentElement;
        li.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    }
    var io = new IntersectionObserver(function (entries) {
      var vis = entries.filter(function (e) { return e.isIntersecting; });
      if (vis.length) {
        vis.sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
        setActive(vis[0].target.id);
      }
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    sections.forEach(function (s) { io.observe(s); });
  }

  /* ── Init ─────────────────────────────────────────────────────────────── */
  function init() {
    renderHero();
    renderTimeline();
    renderEvolution();
    renderProjects();
    renderTenure();
    renderTeam();
    renderClients();
    renderServices();
    setupObservers();
    setupScrollSpy();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
