/* =============================================================================
 * 15th Anniversary page: rendering + interactions
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

  /* ── Teammate name auto-linker ────────────────────────────────────────────
   * Any teammate's name written in body copy is turned bold + linked to their
   * /team/ profile, with a hover/focus preview card. Built once from the team
   * roster. Full names always match; an unambiguous first name also matches. */
  var NAME_RE = null, NAME_MAP = {};
  var FIRST_STOP = { jo: 1, an: 1, april: 1, may: 1, june: 1, art: 1, ray: 1 };
  function reEsc(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function buildNameIndex() {
    var members = ((D.team && D.team.members) || []).filter(function (m) { return m && m.name; });
    var aliases = [];
    var ambiguous = {};
    members.forEach(function (m) {
      var ref = { name: m.name, href: (m.href && m.href !== '/team/') ? m.href : '', img: m.image || '', role: m.role || '' };
      if (!NAME_MAP[m.name]) { NAME_MAP[m.name] = ref; aliases.push(m.name); }
      var first = String(m.name).trim().split(/\s+/)[0];
      if (first && first.length >= 4 && !FIRST_STOP[first.toLowerCase()]) {
        if (NAME_MAP[first] && NAME_MAP[first].name !== m.name) { ambiguous[first] = 1; }
        else if (!NAME_MAP[first]) { NAME_MAP[first] = ref; aliases.push(first); }
      }
    });
    Object.keys(ambiguous).forEach(function (k) { delete NAME_MAP[k]; });
    aliases = aliases.filter(function (a) { return NAME_MAP[a]; })
                     .sort(function (a, b) { return b.length - a.length; });
    NAME_RE = aliases.length ? new RegExp('\\b(' + aliases.map(reEsc).join('|') + ')\\b', 'g') : null;
  }
  // Escape text, THEN wrap any known teammate name in a linked, bold span,
  // THEN convert any [ref:slug]label[/ref] tokens into portfolio-modal triggers.
  // The ref pass runs AFTER esc() so the brackets in source data survive
  // escaping but the label remains rendered.
  function processRefs(safe) {
    return safe.replace(/\[ref:([a-zA-Z0-9_-]+)\]([\s\S]*?)\[\/ref\]/g, function (_m, slug, label) {
      return '<a class="anniv-portfolio-link" href="#" role="button" ' +
             'data-portfolio-ref="' + esc(slug) + '" ' +
             'aria-haspopup="dialog">' + label + '</a>';
    });
  }
  function linkNames(text) {
    var safe = esc(text);
    if (NAME_RE) {
      safe = safe.replace(NAME_RE, function (m) {
        var ref = NAME_MAP[m];
        if (!ref) return m;
        var attrs = ' data-name="' + esc(ref.name) + '"' +
          (ref.img ? ' data-img="' + esc(ref.img) + '"' : '') +
          (ref.role ? ' data-role="' + esc(ref.role) + '"' : '');
        return ref.href
          ? '<a class="anniv-name" href="' + esc(ref.href) + '" target="_blank" rel="noopener"' + attrs + '>' + m + '</a>'
          : '<strong class="anniv-name anniv-name--plain"' + attrs + '>' + m + '</strong>';
      });
    }
    return processRefs(safe);
  }

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

  /* ── "So what" intro band ─────────────────────────────────────────────── */
  function renderSoWhat() {
    var el = $('anniv-sowhat');
    if (!el) return;
    var s = D.soWhat || {};
    var paras = (s.paragraphs || []).filter(Boolean);
    var objs  = (s.objectives || []).filter(Boolean);
    if (!paras.length && !objs.length) { el.innerHTML = ''; return; }
    var html = '<span class="anniv-kicker">' + esc(s.kicker || 'Thank you') + '</span>';
    if (s.headline) {
      // pop "YOU" in a warm gradient when present
      html += '<h2 class="anniv-sowhat-h">' +
        esc(s.headline).replace(/\bYOU\b/, '<span class="anniv-sowhat-you">YOU</span>') + '</h2>';
    }
    html += paras.map(function (p) { return '<p class="anniv-sowhat-p">' + linkNames(p) + '</p>'; }).join('');
    if (objs.length) {
      // The learning objectives live in a distinct callout so they read as a
      // deliberate element, not stray left-aligned text in the centered column.
      html += '<div class="anniv-sowhat-callout">';
      if (s.objectivesIntro) html += '<p class="anniv-sowhat-objintro">' + esc(s.objectivesIntro) + '</p>';
      // Storyline-style checkboxes: tickable, with a check that pops in.
      html += '<ul class="anniv-sowhat-obj">' + objs.map(function (o) {
        return '<li><label class="anniv-check">' +
          '<input type="checkbox" class="anniv-check-input">' +
          '<span class="anniv-check-box" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" ' +
            'stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' +
          '</span>' +
          '<span class="anniv-check-label">' + linkNames(o) + '</span>' +
          '</label></li>';
      }).join('') + '</ul></div>';
    }
    if (s.cta) {
      html += '<a class="anniv-sowhat-cta" href="#history">' + esc(s.cta) +
        ' <span aria-hidden="true">&rarr;</span></a>';
    }
    el.innerHTML = html;
  }

  /* ── Timeline ─────────────────────────────────────────────────────────── */
  function renderChipStrip(highlights) {
    var hs = (highlights || []).filter(function (h) { return h && h.ref; });
    if (!hs.length) return '';
    return '<div class="anniv-tl-chips">' + hs.map(function (h) {
      return '<a class="svc-chip svc-' + esc(h.svc || 'plum') + '" ' +
        'href="#" role="button" data-portfolio-ref="' + esc(h.ref) + '" ' +
        'aria-haspopup="dialog">' + esc(h.label || h.ref) + '</a>';
    }).join('') + '</div>';
  }
  function renderTimeline() {
    var el = $('anniv-timeline');
    if (!el) return;
    var items = (D.timeline || []).filter(function (t) { return t && (t.year || t.title); });
    if (!items.length) { el.innerHTML = empty('Timeline milestones'); return; }
    el.innerHTML = items.map(function (t) {
      var events = (t.events || []).filter(function (e) { return e && (e.theme || e.body); });
      var bodyBlock;
      if (events.length) {
        // Split year: stacked sub-events, each with its own theme + dot + chips.
        bodyBlock =
          (t.body ? '<p class="anniv-tl-body anniv-tl-intro">' + linkNames(t.body) + '</p>' : '') +
          '<ol class="anniv-tl-events" role="list">' + events.map(function (ev) {
            var themeCls = ev.svc ? ' svc-' + esc(ev.svc) : '';
            return '<li class="anniv-tl-event' + themeCls + '">' +
              '<span class="anniv-tl-event-dot" aria-hidden="true"></span>' +
              (ev.theme ? '<h4 class="anniv-tl-event-theme">' + esc(ev.theme) + '</h4>' : '') +
              (ev.body ? '<p class="anniv-tl-event-body">' + linkNames(ev.body) + '</p>' : '') +
              renderChipStrip(ev.highlights) +
              '</li>';
          }).join('') + '</ol>';
      } else {
        // Single-event year: unchanged shape.
        bodyBlock =
          (t.body ? '<p class="anniv-tl-body">' + linkNames(t.body) + '</p>' : '') +
          renderChipStrip(t.highlights);
      }
      // Consistent per-year "New to the team" note (per Ava's consistency
      // ask): every year with hires gets the same compact marker, with
      // names auto-linked so the role hover preview carries the detail.
      var joinsHtml = (t.joins && t.joins.length)
        ? '<div class="anniv-tl-joins">' +
            '<span class="anniv-tl-joins-label">New to the team</span>' +
            '<span class="anniv-tl-joins-names">' +
              t.joins.map(function (n) {
                return '<span class="anniv-tl-join-name">' + linkNames(n) + '</span>';
              }).join('') +
            '</span>' +
          '</div>'
        : '';
      var cls = 'anniv-tl-item reveal' +
        (events.length ? ' anniv-tl-item--split' : '') +
        (t.celebrate ? ' anniv-tl-item--celebrate' : '');
      return '<li class="' + cls + '">' +
        '<span class="anniv-tl-dot"></span>' +
        '<span class="anniv-tl-year">' + esc(t.year || '') + '</span>' +
        (t.tag ? '<span class="anniv-tl-tag">' + esc(t.tag) + '</span>' : '') +
        (t.title ? '<h3 class="anniv-tl-title">' + esc(t.title) + '</h3>' : '') +
        bodyBlock +
        joinsHtml +
        (t.image ? '<img class="anniv-tl-img" src="' + esc(t.image) + '" alt="' + esc(t.title || '') + '" loading="lazy">' : '') +
        '</li>';
    }).join('');
  }

  /* ── Confetti: brand-color burst when a "celebrate" entry scrolls in ───── */
  var CONFETTI_COLORS = ['#600b68', '#b8357b', '#ffbc50', '#4dadb3', '#4d72ac', '#58b0e3', '#f08a3e'];
  function fireConfetti(host) {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    var burst = document.createElement('div');
    burst.className = 'anniv-confetti';
    burst.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < 48; i++) {
      var piece = document.createElement('i');
      var color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      piece.style.setProperty('--c', color);
      piece.style.setProperty('--x', (Math.random() * 100) + '%');
      piece.style.setProperty('--r', (Math.random() * 720 - 360) + 'deg');
      piece.style.setProperty('--d', (Math.random() * 0.7) + 's');
      piece.style.setProperty('--s', (0.6 + Math.random() * 0.8).toFixed(2));
      burst.appendChild(piece);
    }
    host.appendChild(burst);
    // Remove after the longest animation ends so re-entry can fire again.
    setTimeout(function () { if (burst.parentNode) burst.parentNode.removeChild(burst); }, 3400);
  }
  function setupCelebrate() {
    var items = document.querySelectorAll('.anniv-tl-item--celebrate');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) fireConfetti(en.target);
      });
    }, { threshold: 0.5 });
    Array.prototype.forEach.call(items, function (el) { io.observe(el); });
  }

  /* ── Evolution: "subway map" weave + detail legend ────────────────────────
   * Each capability is a line that starts at its year and runs to today, the
   * lines converging into a bundle on the right to show how the streams now
   * weave together (blended media / print / facilitated learning). */
  function buildSubway(stages) {
    var start = (D.meta && D.meta.foundedYear) || stages[0].year || 2011;
    var end   = (D.meta && D.meta.anniversaryYear) ||
                stages.reduce(function (m, s) { return Math.max(m, Number(s.year || 0)); }, start);
    if (end <= start) end = start + 1;

    var VBW = 1000, padL = 156, padR = 150, top = 58, rowH = 62;
    var n = stages.length;
    var mapBottom = top + (n - 1) * rowH;
    var axisY = mapBottom + 58;
    var VBH = axisY + 34;
    var spanX = VBW - padL - padR;
    function xOf(y) {
      var t = (Number(y) - start) / (end - start);
      t = Math.max(0, Math.min(1, t));
      return padL + t * spanX;
    }
    var termX = xOf(end);
    var bundleCenter = top + (n - 1) * rowH / 2;
    var baseConvergeX = padL + spanX * 0.64;

    // year ticks (every 3 yrs from start, always include end)
    var ticks = [];
    for (var y = start; y <= end; y += 3) ticks.push(y);
    if (ticks[ticks.length - 1] !== end) ticks.push(end);

    var grid = ticks.map(function (ty) {
      var x = xOf(ty);
      return '<line class="anniv-subway-grid" x1="' + x + '" y1="' + (top - 26) + '" x2="' + x + '" y2="' + axisY + '"/>' +
             '<text class="anniv-subway-tick" x="' + x + '" y="' + (axisY + 22) + '">' + esc(ty) + '</text>';
    }).join('');

    var lines = stages.map(function (s, i) {
      var color = 'evo-' + (s.color || 'plum');
      var oX = xOf(s.year), oY = top + i * rowH;
      var bY = bundleCenter + (i - (n - 1) / 2) * 13;
      var cX = Math.max(oX + 26, baseConvergeX);
      if (cX > termX - 70) cX = termX - 70;
      if (cX < oX + 12) cX = oX + 12;
      var d = 'M ' + oX + ' ' + oY + ' H ' + cX +
              ' C ' + (cX + 54) + ' ' + oY + ' ' + (termX - 64) + ' ' + bY + ' ' + termX + ' ' + bY;
      return '<g class="anniv-subway-line ' + color + '" data-evo-id="' + esc(s.id || i) + '">' +
        '<title>' + esc(s.stage) + ' · since ' + esc(s.year) + '</title>' +
        '<path class="anniv-subway-path" d="' + d + '"/>' +
        '<circle class="anniv-subway-stop" cx="' + oX + '" cy="' + oY + '" r="7"/>' +
        '<circle class="anniv-subway-term" cx="' + termX + '" cy="' + bY + '" r="4.5"/>' +
        '<text class="anniv-subway-label" x="' + (oX - 16) + '" y="' + (oY - 3) + '" text-anchor="end">' + esc(s.stage) + '</text>' +
        '<text class="anniv-subway-yr" x="' + (oX - 16) + '" y="' + (oY + 13) + '" text-anchor="end">' + esc(s.year) + '</text>' +
        '</g>';
    }).join('');

    var todayLabel =
      '<text class="anniv-subway-today" x="' + (termX + 16) + '" y="' + (bundleCenter - 4) + '">' + esc(end) + '</text>' +
      '<text class="anniv-subway-today-sub" x="' + (termX + 16) + '" y="' + (bundleCenter + 13) + '">Today, woven together</text>';

    return '<div class="anniv-subway-wrap reveal">' +
      '<svg class="anniv-subway" viewBox="0 0 ' + VBW + ' ' + VBH + '" role="img" ' +
      'aria-label="Capability streams from ' + esc(start) + ' to ' + esc(end) + ', each added over time and now converging.">' +
      '<line class="anniv-subway-axis" x1="' + padL + '" y1="' + axisY + '" x2="' + termX + '" y2="' + axisY + '"/>' +
      grid + lines + todayLabel +
      '</svg></div>';
  }

  function renderEvolution() {
    var el = $('anniv-evolution');
    if (!el) return;
    var stages = (D.evolution || []).filter(function (s) { return s && s.stage; });
    if (!stages.length) { el.innerHTML = empty('Evolution stages'); return; }

    var legend = '<div class="anniv-evo-list">' + stages.map(function (s, i) {
      var color = 'evo-' + (s.color || 'plum');
      return '<div class="anniv-evo-row reveal ' + color + '" data-evo-id="' + esc(s.id || i) + '">' +
        '<span class="anniv-evo-swatch" aria-hidden="true"></span>' +
        '<div class="anniv-evo-rowmain">' +
          '<div class="anniv-evo-top">' +
            '<span class="anniv-evo-year">' + esc(s.year != null ? s.year : '·') + '</span>' +
            '<span class="anniv-evo-stage">' + esc(s.stage) + '</span>' +
            (s.tagline ? '<span class="anniv-evo-tagline">' + esc(s.tagline) + '</span>' : '') +
          '</div>' +
          (s.whatWeCouldDo ? '<p class="anniv-evo-what">' + linkNames(s.whatWeCouldDo) + '</p>' : '') +
          (s.proof ? '<div class="anniv-evo-proof">' + linkNames(s.proof) + '</div>' : '') +
        '</div>' +
        '</div>';
    }).join('') + '</div>';

    el.innerHTML = buildSubway(stages) + legend;
  }

  /* ── Evolution hover sync: map line <-> legend card (per Ava's UX note,
   * hovering the lines should visibly connect to the detail cards). ─────── */
  function setupEvoSync() {
    var wrap = $('anniv-evolution');
    if (!wrap) return;
    function pair(id) {
      return wrap.querySelectorAll('[data-evo-id="' + id + '"]');
    }
    function bind(el) {
      var id = el.getAttribute('data-evo-id');
      if (!id) return;
      el.addEventListener('mouseenter', function () {
        Array.prototype.forEach.call(pair(id), function (n) { n.classList.add('is-spotlit'); });
      });
      el.addEventListener('mouseleave', function () {
        Array.prototype.forEach.call(pair(id), function (n) { n.classList.remove('is-spotlit'); });
      });
    }
    Array.prototype.forEach.call(wrap.querySelectorAll('[data-evo-id]'), bind);
  }

  /* ── Projects ─────────────────────────────────────────────────────────── */
  // Filtered list kept in module scope so the modal can look projects up by index.
  var PROJECTS = [];
  function renderProjects() {
    var el = $('anniv-projects');
    if (!el) return;
    PROJECTS = (D.projects || []).filter(function (p) { return p && p.title; });
    if (!PROJECTS.length) { el.innerHTML = empty('Projects'); return; }
    el.innerHTML = PROJECTS.map(function (p, i) {
      // Every card opens a modal demo (embed/video if available, otherwise a
      // write-up with a link out to the full project / related service work).
      var media = p.image
        ? '<div class="anniv-project-media"><img src="' + esc(p.image) + '" alt="' + esc(p.title) + '" loading="lazy"></div>'
        : '';
      // Service-area chip uses the shared svc palette; year/client become the
      // muted meta line below so the chip carries the color story.
      var svcChip = (p.svc && p.serviceArea)
        ? '<div class="anniv-project-svc"><span class="svc-chip svc-' + esc(p.svc) + '">' + esc(p.serviceArea) + '</span></div>'
        : '';
      var metaBits = [p.year, p.client].filter(Boolean).map(esc).join(' · ');
      var hasDemo = !!(p.embedUrl || p.videoUrl);
      var ctaLabel = hasDemo ? (p.videoUrl ? 'Watch the demo' : 'Open the demo') : 'See the work';
      var body =
        '<div class="anniv-project-body">' +
          svcChip +
          (metaBits ? '<div class="anniv-project-meta">' + metaBits + '</div>' : '') +
          '<h3 class="anniv-project-title">' + esc(p.title) + '</h3>' +
          (p.summary ? '<p class="anniv-project-summary">' + linkNames(p.summary) + '</p>' : '') +
          '<span class="anniv-project-cta">' + ctaLabel + ' &rarr;</span>' +
        '</div>';
      return '<article class="anniv-project anniv-project--link reveal" data-i="' + i + '" ' +
        'tabindex="0" role="button" aria-haspopup="dialog" aria-label="' + esc(p.title) + ': open demo">' +
        media + body + '</article>';
    }).join('');
  }

  /* ── Work modal: launches a demo (embed/video) or a write-up + link out ─── */
  var MODAL = null;
  function ensureModal() {
    if (MODAL) return MODAL;
    var overlay = document.createElement('div');
    overlay.className = 'anniv-modal';
    overlay.setAttribute('hidden', '');
    overlay.innerHTML =
      '<div class="anniv-modal-backdrop" data-close></div>' +
      '<div class="anniv-modal-card" role="dialog" aria-modal="true" aria-labelledby="anniv-modal-title">' +
        '<button type="button" class="anniv-modal-close" data-close aria-label="Close">&times;</button>' +
        '<div class="anniv-modal-meta"></div>' +
        '<h3 class="anniv-modal-title" id="anniv-modal-title"></h3>' +
        '<div class="anniv-modal-media"></div>' +
        '<div class="anniv-modal-body"></div>' +
        '<div class="anniv-modal-actions"></div>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-close')) closeModal();
    });
    MODAL = overlay;
    return overlay;
  }
  var lastFocus = null;

  // Shared fill: works for both project cards and portfolio refs. The two data
  // shapes match (title/client/year/serviceArea/summary/embedUrl/videoUrl/image/
  // link/href), so the modal-fill logic is identical.
  function openItemModal(p) {
    if (!p || !p.title) return;
    var m = ensureModal();
    lastFocus = document.activeElement;
    track('anniv_project_open', { item: p.title, item_client: p.client || '', item_svc: p.svc || '', section: activeSection() });
    var metaBits = [p.year, p.serviceArea, p.client].filter(Boolean).map(esc).join(' · ');
    m.querySelector('.anniv-modal-meta').innerHTML = metaBits;
    m.querySelector('.anniv-modal-title').textContent = p.title;

    var mediaEl = m.querySelector('.anniv-modal-media');
    var cardEl  = m.querySelector('.anniv-modal-card');
    // live web/Storyline embeds need a bigger frame than 16:9 video/images
    if (cardEl) cardEl.classList.remove('anniv-modal-card--demo');
    if (p.embedUrl) {
      mediaEl.innerHTML = '<iframe src="' + esc(p.embedUrl) + '" title="' + esc(p.title) +
        '" loading="lazy" allowfullscreen></iframe>';
      mediaEl.hidden = false;
      if (cardEl) cardEl.classList.add('anniv-modal-card--demo');
    } else if (p.videoUrl) {
      mediaEl.innerHTML = '<iframe src="' + esc(p.videoUrl) + '" title="' + esc(p.title) +
        '" loading="lazy" allow="autoplay; fullscreen" allowfullscreen></iframe>';
      mediaEl.hidden = false;
    } else if (p.image || p.modalImage) {
      // modalImage shows in the modal only (the card never renders it), for
      // projects where we want a clean text card but a visual in the popup.
      mediaEl.innerHTML = '<img src="' + esc(p.image || p.modalImage) + '" alt="' + esc(p.title) + '">';
      mediaEl.hidden = false;
    } else {
      mediaEl.innerHTML = '';
      mediaEl.hidden = true;
    }

    // Body: split on blank lines so long summaries render as paragraphs.
    m.querySelector('.anniv-modal-body').innerHTML = p.summary
      ? p.summary.split(/\n\s*\n/).map(function (para) {
          var trimmed = para.replace(/\n+/g, ' ').trim();
          return trimmed ? '<p>' + linkNames(trimmed) + '</p>' : '';
        }).join('')
      : '';

    var dest = p.link || p.href || '';
    var actions = '';
    if (dest) {
      var external = /^https?:/i.test(dest);
      var tgt = external ? ' target="_blank" rel="noopener"' : '';
      // Per-item override via p.linkLabel; otherwise pick a default based on
      // whether this is a case-study link (p.link) or a related-work fallback.
      var label = p.linkLabel || (p.link ? 'View the full case study' : 'Explore related work');
      actions = '<a class="anniv-modal-btn" href="' + esc(dest) + '"' + tgt + '>' + esc(label) + ' &rarr;</a>';
    }
    m.querySelector('.anniv-modal-actions').innerHTML = actions;

    m.removeAttribute('hidden');
    document.documentElement.classList.add('anniv-modal-open');
    requestAnimationFrame(function () { m.classList.add('is-on'); });
    var closeBtn = m.querySelector('.anniv-modal-close');
    if (closeBtn) closeBtn.focus();
  }
  /* ── Analytics (GA4) ──────────────────────────────────────────────────────
   * The shared analytics partial already fires the inbound page_view (with
   * UTM attribution) and a cross-domain linker for the integral-ed family.
   * These add explicit engagement + OUTBOUND events for this campaign page,
   * so leaving to YouTube/StriveTogether/PLTW/Loom/etc. is captured even if
   * GA4 enhanced-measurement outbound clicks aren't enabled. */
  function track(name, params) {
    try { if (typeof window.gtag === 'function') window.gtag('event', name, params || {}); } catch (e) {}
  }
  function activeSection() {
    var a = document.querySelector('.anniv-rail-nav li.active a');
    return a ? a.getAttribute('href').replace('#', '') : '';
  }
  function setupAnalytics() {
    // Capture-phase so the event records before a target=_blank tab steals focus.
    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (!/^https?:\/\//i.test(href)) return;            // relative/internal: skip
      var host;
      try { host = new URL(href, location.href).hostname; } catch (_e) { return; }
      if (host === location.hostname) return;             // same-site: skip
      track('anniv_outbound', {
        link_url: href,
        link_domain: host,
        link_text: (a.textContent || '').trim().slice(0, 80),
        section: activeSection()
      });
    }, true);
    // Internal campaign CTAs (same-site, so the outbound handler skips them).
    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (/\/join-our-team\/?/.test(href)) track('anniv_join_click', { section: activeSection() });
      else if (a.closest('.anniv-cta-box') && /\/contact\//.test(href)) track('anniv_schedule_click', { source: 'scroll_cta' });
    }, true);
  }

  function openProjectModal(i)     { openItemModal(PROJECTS[i]); }
  function openPortfolioModal(slug) {
    var p = (D.portfolio || {})[slug];
    if (!p) { console.warn('[anniversary] unknown portfolio ref:', slug); return; }
    openItemModal(p);
  }
  function closeModal() {
    if (!MODAL) return;
    MODAL.classList.remove('is-on');
    document.documentElement.classList.remove('anniv-modal-open');
    var m = MODAL;
    setTimeout(function () {
      m.setAttribute('hidden', '');
      var media = m.querySelector('.anniv-modal-media');
      if (media) media.innerHTML = '';   // stop any playing embed/video
    }, 200);
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
  }
  function setupProjectModal() {
    var grid = $('anniv-projects');
    if (grid) {
      grid.addEventListener('click', function (e) {
        var card = e.target.closest ? e.target.closest('.anniv-project[data-i]') : null;
        if (!card) return;
        openProjectModal(Number(card.getAttribute('data-i')));
      });
      grid.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        var card = e.target.closest ? e.target.closest('.anniv-project[data-i]') : null;
        if (!card) return;
        e.preventDefault();
        openProjectModal(Number(card.getAttribute('data-i')));
      });
    }
    // Delegated portfolio-ref links can live in timeline / evolution / anywhere.
    document.addEventListener('click', function (e) {
      var link = e.target.closest ? e.target.closest('[data-portfolio-ref]') : null;
      if (!link) return;
      e.preventDefault();
      openPortfolioModal(link.getAttribute('data-portfolio-ref'));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && MODAL && !MODAL.hasAttribute('hidden')) closeModal();
    });
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
        ? '<a class="' + cls + '" href="' + esc(m.href) + '" target="_blank" rel="noopener" style="--d:' + (i * 30) + 'ms">' + inner + '</a>'
        : '<div class="' + cls + '" style="--d:' + (i * 30) + 'ms">' + inner + '</div>';
    }).join('');
  }

  /* ── Clients ──────────────────────────────────────────────────────────── */
  // Bold the first comma-separated chunk of an attribution string ("Heidi
  // Black" in "Heidi Black, VP of Training, StriveTogether") and leave the
  // role + org as muted runtime text. Keeps the data clean (one string).
  function formatAttribution(s) {
    if (!s) return '';
    var i = s.indexOf(',');
    if (i < 0) return '<strong>' + esc(s) + '</strong>';
    return '<strong>' + esc(s.slice(0, i)) + '</strong>' + esc(s.slice(i));
  }
  function renderClients() {
    var c = D.clients || {};
    var feat = $('anniv-clients-featured');
    if (feat) {
      var fs = (c.featured || []).filter(function (f) { return f && (f.name || f.logo); });
      feat.innerHTML = fs.map(function (f) {
        var svcCls = f.svc ? ' svc-' + esc(f.svc) : '';
        return '<article class="anniv-client-card reveal' + svcCls + '">' +
          '<span class="anniv-client-mark" aria-hidden="true">&ldquo;</span>' +
          (f.quote ? '<blockquote class="anniv-client-quote">' + esc(f.quote) + '</blockquote>' : '') +
          (f.quoteAttribution
            ? '<p class="anniv-client-attribution">' + formatAttribution(f.quoteAttribution) + '</p>'
            : '') +
          (f.story
            ? '<p class="anniv-client-story">' + linkNames(f.story) + '</p>'
            : '') +
          (f.logo
            ? '<img class="anniv-client-logo" src="' + esc(f.logo) + '" alt="' + esc(f.name || '') + '" loading="lazy">'
            : (f.name ? '<span class="anniv-client-name">' + esc(f.name) + '</span>' : '')) +
          '</article>';
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
      // The rail items also pick up the svc swatch: a small left dot keeps
      // the legend visible even in the compact sticky nav.
      rail.innerHTML = areas.map(function (s) {
        var cls = s.svc ? ' class="svc-' + esc(s.svc) + '"' : '';
        return '<li' + cls + '><a href="' + esc(s.href || '#') + '">' + esc(s.name) + '</a></li>';
      }).join('');
    }
    var grid = $('anniv-services');
    if (grid) {
      grid.innerHTML = areas.map(function (s) {
        var svcCls = s.svc ? ' svc-' + esc(s.svc) : '';
        return '<a class="anniv-service reveal' + svcCls + '" href="' + esc(s.href || '#') + '">' +
          '<span class="anniv-service-name">' + esc(s.name) + '</span> ' +
          '<span class="anniv-service-arrow">→</span></a>';
      }).join('');
    }
  }

  /* ── Counter animation ────────────────────────────────────────────────── */
  // The counters live in the hero, which is visible the instant the page loads,
  // even while the password gate is still covering it. If we animated right away
  // the count-up would finish behind the gate and the user would never see it.
  // So defer the count-up until the page is actually unlocked.
  function isLocked() {
    return document.documentElement.classList.contains('anniv-locked');
  }
  function whenUnlocked(fn) {
    if (!isLocked()) { fn(); return; }
    document.addEventListener('anniv:unlocked', function once() {
      document.removeEventListener('anniv:unlocked', once);
      fn();
    });
  }
  function animateCounter(el) {
    whenUnlocked(function () {
      // Cancel any in-flight animation on this counter so re-entry triggers a
      // fresh count-up from zero, even mid-roll.
      if (el._rafId) cancelAnimationFrame(el._rafId);
      var target = Number(el.getAttribute('data-target') || 0);
      var suffix = el.getAttribute('data-suffix') || '';
      el.textContent = '0' + suffix;
      var dur = 1600, start = null;
      function tick(ts) {
        if (start == null) start = ts;
        var t = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(eased * target).toLocaleString() + suffix;
        if (t < 1) el._rafId = requestAnimationFrame(tick);
        else el._rafId = null;
      }
      el._rafId = requestAnimationFrame(tick);
    });
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

    // Don't unobserve so the counters re-animate every time they re-enter
    // the viewport (e.g. when scrolling back up to the hero). animateCounter
    // resets to 0 + cancels any in-flight RAF so re-entries always restart
    // cleanly.
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) animateCounter(en.target);
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

  /* ── Teammate name hover/focus preview ────────────────────────────────── */
  function setupNamePreviews() {
    var names = document.querySelectorAll('a.anniv-name[data-img]');
    if (!names.length) return;
    var pop = document.createElement('div');
    pop.className = 'anniv-name-pop';
    pop.setAttribute('hidden', '');
    pop.innerHTML = '<img class="anniv-name-pop-img" alt=""><div class="anniv-name-pop-txt">' +
      '<span class="anniv-name-pop-name"></span><span class="anniv-name-pop-role"></span></div>';
    document.body.appendChild(pop);
    var img  = pop.querySelector('.anniv-name-pop-img');
    var nmEl = pop.querySelector('.anniv-name-pop-name');
    var rlEl = pop.querySelector('.anniv-name-pop-role');
    var hideT;

    function show(a) {
      clearTimeout(hideT);
      img.src = a.getAttribute('data-img') || '';
      nmEl.textContent = a.getAttribute('data-name') || a.textContent;
      rlEl.textContent = a.getAttribute('data-role') || '';
      pop.removeAttribute('hidden');
      // measure, then position (prefer above; flip below near the top edge)
      var r = a.getBoundingClientRect();
      var ph = pop.offsetHeight, pw = pop.offsetWidth;
      var cx = r.left + r.width / 2;
      var left = Math.max(10, Math.min(window.innerWidth - pw - 10, cx - pw / 2));
      pop.style.left = left + 'px';
      if (r.top > ph + 14) { pop.style.top = (r.top - ph - 10) + 'px'; pop.classList.remove('below'); }
      else { pop.style.top = (r.bottom + 10) + 'px'; pop.classList.add('below'); }
      pop.style.setProperty('--arrow-x', (cx - left) + 'px');
      pop.classList.add('is-on');
    }
    function hide() {
      pop.classList.remove('is-on');
      hideT = setTimeout(function () { pop.setAttribute('hidden', ''); }, 160);
    }
    Array.prototype.forEach.call(names, function (a) {
      a.addEventListener('mouseenter', function () { show(a); });
      a.addEventListener('mouseleave', hide);
      a.addEventListener('focus', function () { show(a); });
      a.addEventListener('blur', hide);
    });
  }

  /* ── Subway map: draw the lines in when the section scrolls into view ───── */
  function setupSubway() {
    var wrap = document.querySelector('.anniv-subway-wrap');
    if (!wrap) return;
    var paths = wrap.querySelectorAll('.anniv-subway-path');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    Array.prototype.forEach.call(paths, function (p, i) {
      var len = 0;
      try { len = p.getTotalLength(); } catch (e) { len = 0; }
      if (len && !reduce) {
        p.style.strokeDasharray = len;
        p.style.strokeDashoffset = len;
        p.style.transitionDelay = (i * 180) + 'ms';
      }
    });
    function draw() { wrap.classList.add('is-drawn'); }
    if (reduce || !('IntersectionObserver' in window)) { draw(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { draw(); io.disconnect(); } });
    }, { threshold: 0.25 });
    io.observe(wrap);
  }

  /* ── Init ─────────────────────────────────────────────────────────────── */
  /* ── Guided "click-through" tour (mode=tour) ──────────────────────────────
   * An optional paginated walkthrough. Activated by the hero "Take the tour"
   * button or by ?mode=tour in the URL. Non-trapping: the left-rail nav and
   * free scroll still work; Esc or "Exit tour" returns to normal browsing.
   * v1 steps section by section; finer sub-steps (timeline years, evolution
   * layers one at a time) are a planned enhancement. */
  function setupTour() {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var idx = 0, on = false, STEPS = null;

    // Bite-sized steps: section overviews, then a step per timeline YEAR,
    // per evolution SERVICE line, and per WORK project. Built from the rendered
    // DOM so it always matches the data.
    function txt(el, sel) { var n = el && el.querySelector(sel); return n ? n.textContent.trim() : ''; }
    function buildSteps() {
      var out = [];
      function push(o) { out.push(o); }
      function brk(title, lede) { push({ kind: 'break', title: title, lede: lede || '' }); }
      function sectionStep(id, title, caption) {
        var el = document.getElementById(id);
        if (el) push({ el: el, section: el, kind: 'section', title: title, caption: caption });
      }

      // Openers (no section break)
      sectionStep('intro',   'Welcome',                 'Fifteen years, by the numbers.');
      sectionStep('welcome', 'Thanks for your support', 'Almost all of our growth has come from you.');
      // The learning objectives get their own slide
      var calloutEl = document.querySelector('#welcome .anniv-sowhat-callout');
      if (calloutEl) push({ el: calloutEl, section: document.getElementById('welcome'),
        kind: 'objectives', title: 'Learning objectives', caption: "What you'll be able to do by the end." });

      // History: a step per YEAR
      var historyEl = document.getElementById('history');
      if (historyEl) {
        var years = historyEl.querySelectorAll('.anniv-tl-item');
        if (years.length) {
          brk('How it started, and how it grew', "The story you've been part of, one turning point at a time.");
          Array.prototype.forEach.call(years, function (el) {
            var evs = el.querySelectorAll('.anniv-tl-event');
            if (evs.length > 1) {
              // A year that added more than one capability splits into a card
              // per service, so each new service gets its own focused slide.
              Array.prototype.forEach.call(evs, function (ev) {
                push({ el: el, section: historyEl, kind: 'year', eventEl: ev,
                  title: txt(el, '.anniv-tl-year') || 'History', caption: txt(ev, '.anniv-tl-event-theme') });
              });
            } else {
              push({ el: el, section: historyEl, kind: 'year',
                title: txt(el, '.anniv-tl-year') || 'History', caption: txt(el, '.anniv-tl-title') });
            }
          });
        }
      }

      // Evolution: feature the SUBWAY MAP, light up one line per step, with the
      // card text overlaid. Falls back to legend cards when the map is hidden.
      var evoSection = document.getElementById('evolution');
      if (evoSection) {
        var evoMap = evoSection.querySelector('.anniv-subway-wrap');
        var mapVisible = evoMap && evoMap.offsetParent !== null;
        var rows = evoSection.querySelectorAll('.anniv-evo-row');
        if (rows.length) {
          brk('Each year, a new thing we could do', 'Every capability we added so we could do more for you.');
          Array.prototype.forEach.call(rows, function (row) {
            push({
              // On mobile the wide subway map doesn't frame in portrait, so
              // spotlight the legend ROW and float it as a centered card instead.
              el: (mapVisible && !isMobileTour()) ? evoMap : row, section: evoSection, kind: 'service',
              title: txt(row, '.anniv-evo-stage') || 'Capability',
              caption: txt(row, '.anniv-evo-what') || txt(row, '.anniv-evo-tagline'),
              evoId: row.getAttribute('data-evo-id') || null,
              evoYear: txt(row, '.anniv-evo-year'),
              evoWhat: txt(row, '.anniv-evo-what'),
              evoProof: txt(row, '.anniv-evo-proof')
            });
          });
        }
      }

      // Work: a step per project
      var workEl = document.getElementById('work');
      if (workEl) {
        var projects = workEl.querySelectorAll('.anniv-project');
        if (projects.length) {
          brk("Work we're proud of", 'A few projects we built with partners like you.');
          Array.prototype.forEach.call(projects, function (el) {
            push({ el: el, section: workEl, kind: 'work',
              title: txt(el, '.anniv-project-title') || 'Project', caption: txt(el, '.anniv-project-meta') });
          });
        }
      }

      // Team: on mobile, page through one teammate at a time as centered cards
      // (on desktop the grid reads fine as a single scroll step).
      var teamEl = document.getElementById('team');
      if (teamEl) {
        brk('The people behind the work', "The team you've worked with.");
        var teamMembers = teamEl.querySelectorAll('.anniv-member');
        if (teamMembers.length && isMobileTour()) {
          Array.prototype.forEach.call(teamMembers, function (m) {
            push({ el: m, section: teamEl, kind: 'teammate',
              title: txt(m, '.anniv-member-name') || 'Teammate', caption: txt(m, '.anniv-member-role') });
          });
        } else {
          push({ el: teamEl, section: teamEl, kind: 'section', title: 'The Team', caption: 'Scroll through everyone.' });
        }
      }

      // Clients: a step per testimonial, quote shown large
      var clientsSection = document.getElementById('clients');
      if (clientsSection) {
        var clientCards = clientsSection.querySelectorAll('.anniv-client-card');
        brk("Who we've grown alongside", 'Partners like you, in their words.');
        if (clientCards.length) {
          Array.prototype.forEach.call(clientCards, function (card) {
            var logo = card.querySelector('.anniv-client-logo');
            var nm = (logo && logo.getAttribute('alt')) || txt(card, '.anniv-client-name') || 'A partner';
            push({ el: card, section: clientsSection, kind: 'client',
              title: nm, caption: txt(card, '.anniv-client-attribution') });
          });
        } else {
          push({ el: clientsSection, section: clientsSection, kind: 'section',
            title: 'Clients', caption: 'Who we have grown alongside.' });
        }
      }

      // (The "What we do today" section is intentionally skipped in the tour:
      // those service areas are already paged through as the Evolution service
      // cards, and the section overview had no real focus. Tour ends on the
      // finale right after Clients.)

      // Finale (no break)
      push({ el: finaleEl, section: null, kind: 'finale',
        title: "Here's to the next fifteen", caption: 'Thanks for taking the tour.' });

      // Each break's "Skip" jumps to the next break (or the finale).
      var last = out.length - 1;
      for (var i = 0; i < out.length; i++) {
        if (out[i].kind !== 'break') continue;
        var target = last;
        for (var j = i + 1; j < out.length; j++) { if (out[j].kind === 'break') { target = j; break; } }
        out[i].skipTo = target;
      }
      return out;
    }

    var bar = document.createElement('div');
    bar.className = 'anniv-tour';
    bar.setAttribute('hidden', '');
    bar.innerHTML =
      '<div class="anniv-tour-bar" role="region" aria-label="Guided tour">' +
        '<button type="button" class="anniv-tour-exit" data-act="exit">Exit tour</button>' +
        '<div class="anniv-tour-info">' +
          '<span class="anniv-tour-step"></span>' +
          '<span class="anniv-tour-title"></span>' +
          '<span class="anniv-tour-caption"></span>' +
        '</div>' +
        '<div class="anniv-tour-nav">' +
          '<button type="button" class="anniv-tour-prev" data-act="prev" aria-label="Previous step">&larr;</button>' +
          '<button type="button" class="anniv-tour-next" data-act="next">Next &rarr;</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(bar);

    var backdrop = document.createElement('div');
    backdrop.className = 'anniv-tour-backdrop';
    document.body.appendChild(backdrop);

    // Closing CTA card shown as the final tour step (share + schedule).
    var finaleEl = document.createElement('div');
    finaleEl.className = 'anniv-tour-finale';
    finaleEl.setAttribute('hidden', '');
    finaleEl.innerHTML =
      '<div class="anniv-tour-finale-card" role="dialog" aria-label="Tour finale">' +
        '<p class="anniv-tour-finale-kicker">That\'s our fifteen years</p>' +
        '<h2 class="anniv-tour-finale-h">Here\'s to the next fifteen.</h2>' +
        '<p class="anniv-tour-finale-sub">Bring us the project you\'re trying to move forward, and we\'ll help you find the right starting point.</p>' +
        '<div class="anniv-tour-finale-actions">' +
          '<a class="anniv-tour-finale-btn anniv-tour-finale-btn--primary" data-act="schedule" href="/contact/?ref=15th-anniversary-tour">Schedule a conversation &rarr;</a>' +
          '<button type="button" class="anniv-tour-finale-btn anniv-tour-finale-btn--ghost" data-act="refer">Introduce us to a colleague &rarr;</button>' +
        '</div>' +
        '<div class="anniv-tour-finale-foot">' +
          '<button type="button" data-act="share">Share this story</button>' +
          '<button type="button" data-act="restart">&#8634; Restart the tour</button>' +
          '<button type="button" data-act="exit">Explore on your own</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(finaleEl);

    // Section-break "slide" shown before each section's steps (slideshow style).
    var breakEl = document.createElement('div');
    breakEl.className = 'anniv-tour-break';
    breakEl.setAttribute('hidden', '');
    breakEl.innerHTML =
      '<div class="anniv-tour-break-card" role="dialog" aria-label="Up next">' +
        '<p class="anniv-tour-break-kicker">Up next</p>' +
        '<h2 class="anniv-tour-break-h"></h2>' +
        '<p class="anniv-tour-break-lede"></p>' +
        '<div class="anniv-tour-break-actions">' +
          '<button type="button" class="anniv-tour-break-btn anniv-tour-break-btn--primary" data-act="next">Next &rarr;</button>' +
          '<button type="button" class="anniv-tour-break-btn anniv-tour-break-btn--ghost" data-act="skip">Skip this section</button>' +
        '</div>' +
        '<button type="button" class="anniv-tour-break-exit" data-act="exit">Exit tour</button>' +
      '</div>';
    document.body.appendChild(breakEl);
    var brkH = breakEl.querySelector('.anniv-tour-break-h');
    var brkLede = breakEl.querySelector('.anniv-tour-break-lede');

    // Evolution overlay: the active service's card text, laid over the map frame.
    var evoWrap = document.querySelector('#evolution .anniv-subway-wrap');
    var evoOverlay = null;
    if (evoWrap) {
      evoOverlay = document.createElement('div');
      evoOverlay.className = 'anniv-evo-overlay';
      evoOverlay.setAttribute('hidden', '');
      evoOverlay.innerHTML =
        '<span class="anniv-evo-overlay-yr"></span>' +
        '<h3 class="anniv-evo-overlay-stage"></h3>' +
        '<p class="anniv-evo-overlay-what"></p>' +
        '<p class="anniv-evo-overlay-proof"></p>';
      evoWrap.appendChild(evoOverlay);
    }

    var elStep  = bar.querySelector('.anniv-tour-step');
    var elTitle = bar.querySelector('.anniv-tour-title');
    var elCap   = bar.querySelector('.anniv-tour-caption');
    var btnPrev = bar.querySelector('.anniv-tour-prev');
    var btnNext = bar.querySelector('.anniv-tour-next');

    var relocatedCard = null;
    function clearSpot() {
      // Put any lifted-to-body card back where it came from.
      if (relocatedCard) {
        var rc = relocatedCard; relocatedCard = null;
        if (rc.next && rc.next.parentNode === rc.parent) rc.parent.insertBefore(rc.el, rc.next);
        else rc.parent.appendChild(rc.el);
      }
      Array.prototype.forEach.call(document.querySelectorAll('.is-tour-spot'),
        function (n) { n.classList.remove('is-tour-spot'); });
      Array.prototype.forEach.call(document.querySelectorAll('.anniv-main > section.is-tour-focus'),
        function (n) { n.classList.remove('is-tour-focus'); });
      Array.prototype.forEach.call(document.querySelectorAll('.anniv-subway-line.is-spotlit, .anniv-evo-row.is-spotlit'),
        function (n) { n.classList.remove('is-spotlit'); });
      Array.prototype.forEach.call(document.querySelectorAll('.anniv-tl-item.is-tour-split'),
        function (n) { n.classList.remove('is-tour-split'); });
      Array.prototype.forEach.call(document.querySelectorAll('.anniv-tl-event.is-tour-event'),
        function (n) { n.classList.remove('is-tour-event'); });
    }
    function spotlight(step) {
      clearSpot();
      if (evoOverlay) evoOverlay.setAttribute('hidden', '');
      if (step.kind === 'finale' || step.kind === 'break') {
        document.documentElement.classList.add('anniv-tour-spot');
        return;
      }
      // backdrop "stage" only for the bite-sized item steps, not section overviews
      document.documentElement.classList.toggle('anniv-tour-spot', step.kind !== 'section');
      if (step.section) step.section.classList.add('is-tour-focus');
      if (step.el !== step.section) step.el.classList.add('is-tour-spot');
      // Multi-service year: show only this service's strand on the card.
      if (step.eventEl) {
        step.el.classList.add('is-tour-split');
        step.eventEl.classList.add('is-tour-event');
      }
      // ROOT CAUSE of the recurring "mask": iOS Safari clips position:fixed
      // elements to any ancestor that establishes a containing block — our
      // sections use overflow:hidden, the layout uses overflow-x:clip, the dark
      // sections blur glow blobs (filter), and the team is an overflow carousel.
      // Chromium (the preview engine) does NOT clip in these cases, so the cards
      // look perfect in preview but are masked on a real iPhone. The only robust
      // fix is to lift EVERY centered card out to <body>, which has no trapping
      // ancestor (restored in clearSpot).
      var liftToBody = step.kind === 'client' || step.kind === 'teammate'
        || ((step.kind === 'service' || step.kind === 'work') && isMobileTour());
      if (liftToBody && step.el && step.el.parentNode && step.el.parentNode !== document.body) {
        relocatedCard = { el: step.el, parent: step.el.parentNode, next: step.el.nextSibling };
        document.body.appendChild(step.el);
      }
      if (step.evoId && !isMobileTour()) {
        Array.prototype.forEach.call(document.querySelectorAll('[data-evo-id="' + step.evoId + '"]'),
          function (n) { n.classList.add('is-spotlit'); });
        var wrap = document.querySelector('.anniv-subway-wrap');
        if (wrap) wrap.classList.add('is-drawn');   // make sure the lines are drawn in
        if (evoOverlay) {
          evoOverlay.querySelector('.anniv-evo-overlay-yr').textContent    = step.evoYear || '';
          evoOverlay.querySelector('.anniv-evo-overlay-stage').textContent = step.title || '';
          evoOverlay.querySelector('.anniv-evo-overlay-what').textContent  = step.evoWhat || '';
          evoOverlay.querySelector('.anniv-evo-overlay-proof').textContent = step.evoProof || '';
          evoOverlay.removeAttribute('hidden');
        }
      }
    }
    function render() {
      var s = STEPS[idx];
      elStep.textContent  = (idx + 1) + ' / ' + STEPS.length;
      elTitle.textContent = s.title;
      elCap.textContent   = s.caption || '';
      btnPrev.disabled    = (idx === 0);
      // finale + section-break cards carry their own forward actions
      // Only the finale hides the bar's Next (it has its own CTAs). Section
      // breaks KEEP the bar Next visible so you can click straight through
      // without reaching up to the centered break card.
      var ownActions = (s.kind === 'finale');
      btnNext.style.display = ownActions ? 'none' : '';
      btnNext.textContent = (idx === STEPS.length - 1) ? 'Finish' : 'Next →';
    }
    function isMobileTour() {
      return !!(window.matchMedia && window.matchMedia('(max-width: 880px)').matches);
    }
    function go(i) {
      idx = Math.max(0, Math.min(STEPS.length - 1, i));
      var step = STEPS[idx];
      if (finaleEl) { if (step.kind === 'finale') finaleEl.removeAttribute('hidden'); else finaleEl.setAttribute('hidden', ''); }
      if (breakEl) {
        if (step.kind === 'break') { brkH.textContent = step.title || ''; brkLede.textContent = step.lede || ''; breakEl.removeAttribute('hidden'); }
        else breakEl.setAttribute('hidden', '');
      }
      spotlight(step);
      // finale, break, and client cards are fixed/centered overlays: no scroll
      // Centered-card steps (overlays) don't scroll. On mobile, service and
      // teammate steps join the client cards as centered overlays.
      var centeredCard = step.kind === 'finale' || step.kind === 'break' || step.kind === 'client'
        || step.kind === 'teammate'
        || ((step.kind === 'service' || step.kind === 'work') && isMobileTour());
      if (!centeredCard) {
        if (isMobileTour() && step.kind !== 'section') {
          // Center the focused piece in the stage ABOVE the playbar (nav + rail
          // are hidden on mobile during the tour), not the naive viewport center,
          // which would tuck it behind the bar.
          requestAnimationFrame(function () {
            var barH = bar ? bar.offsetHeight : 84;
            var r = step.el.getBoundingClientRect();
            var target = window.pageYOffset + r.top + r.height / 2 - (window.innerHeight - barH) / 2;
            try { window.scrollTo({ top: Math.max(0, target), behavior: reduce ? 'auto' : 'smooth' }); }
            catch (e) { window.scrollTo(0, Math.max(0, target)); }
          });
        } else {
          // Section steps land at their top; but if the section holds the team
          // gallery, center THAT so it isn't cut off under the bar.
          var tgt = step.el, blk = (step.kind === 'section') ? 'start' : 'center';
          if (step.kind === 'section' && step.section) {
            var gallery = step.section.querySelector('.anniv-team-stage');
            if (gallery) { tgt = gallery; blk = 'center'; }
          }
          try { tgt.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: blk }); } catch (e) {}
        }
      }
      render();
      if (step.kind === 'finale') { track('anniv_tour_finish', {}); fireConfetti(finaleEl); }
    }
    function setModeParam(active) {
      try {
        var url = new URL(window.location.href);
        if (active) url.searchParams.set('mode', 'tour'); else url.searchParams.delete('mode');
        window.history.replaceState(null, '', url);
      } catch (e) {}
    }
    // The teammate photos (and project images) are loading="lazy", so the first
    // time each card is shown the image fetches on demand and lags. Warm them
    // into cache when the tour starts; by the time you page to them they're ready.
    var preloaded = false;
    function preloadTourImages() {
      if (preloaded) return; preloaded = true;
      var imgs = document.querySelectorAll('#anniv-team .anniv-member-photo, #anniv-projects .anniv-project-media img');
      Array.prototype.forEach.call(imgs, function (img) {
        var src = img.getAttribute('src');
        if (src) { var p = new Image(); p.src = src; }
      });
    }
    function start(at) {
      if (on) return;
      if (!STEPS) STEPS = buildSteps();
      if (!STEPS.length) return;
      preloadTourImages();
      on = true;
      document.documentElement.classList.add('anniv-tour-on');
      bar.removeAttribute('hidden');
      setModeParam(true);
      track('anniv_tour_start', { steps: STEPS.length });
      go(typeof at === 'number' ? at : 0);
    }
    function stop() {
      if (!on) return;
      on = false;
      document.documentElement.classList.remove('anniv-tour-on', 'anniv-tour-spot');
      bar.setAttribute('hidden', '');
      if (finaleEl) finaleEl.setAttribute('hidden', '');
      if (breakEl) breakEl.setAttribute('hidden', '');
      if (evoOverlay) evoOverlay.setAttribute('hidden', '');
      clearSpot();
      setModeParam(false);
    }

    bar.addEventListener('click', function (e) {
      var act = e.target.getAttribute && e.target.getAttribute('data-act');
      if (act === 'next') { idx === STEPS.length - 1 ? stop() : go(idx + 1); }
      else if (act === 'prev') go(idx - 1);
      else if (act === 'exit') stop();
    });

    // Shared links point at the naked page URL (no #section / ?mode=tour) so the
    // recipient lands on the welcome, plus a ?ref=share token so GA4 can
    // attribute the traffic.
    function shareUrl() {
      try { return window.location.origin + window.location.pathname + '?ref=share'; }
      catch (e) { return window.location.href; }
    }
    // "Spread the word": copy the link and show a well-defined confirmation
    // (with an email option), instead of the native share sheet, which on
    // desktop is an unpredictable OS panel.
    function shareTour(btn) {
      track('anniv_tour_share', {});
      var url = shareUrl();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(
          function () { openSharePop(btn, url, false); },
          function () { openSharePop(btn, url, true); }
        );
      } else {
        openSharePop(btn, url, true);
      }
    }

    var sharePop = null, sharePopCloser = null;
    function closeSharePop() { if (sharePopCloser) sharePopCloser(); }
    function openSharePop(btn, url, copyFailed) {
      closeSharePop();
      if (!sharePop) {
        sharePop = document.createElement('div');
        sharePop.className = 'anniv-share-pop';
        sharePop.setAttribute('role', 'status');
        sharePop.innerHTML =
          '<p class="anniv-share-pop-msg"><span class="anniv-share-pop-check" aria-hidden="true">✓</span> <span class="anniv-share-pop-msg-txt"></span></p>' +
          '<p class="anniv-share-pop-help">Paste it to a colleague who’d find it useful.</p>' +
          '<p class="anniv-share-pop-url"></p>' +
          '<a class="anniv-share-pop-email" href="#">Email it to someone &rarr;</a>';
        document.body.appendChild(sharePop);
      }
      sharePop.querySelector('.anniv-share-pop-msg-txt').textContent = copyFailed ? 'Copy this link' : 'Link copied';
      sharePop.querySelector('.anniv-share-pop-url').textContent = url;
      var subject = 'Thought you might find this useful';
      var body = "I've partnered with Integral Ed and thought of you. Here's a look at their work over the last fifteen years:\n\n" + url + "\n";
      var emailLink = sharePop.querySelector('.anniv-share-pop-email');
      emailLink.href = 'mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      emailLink.onclick = function () { track('anniv_tour_refer', {}); closeSharePop(); };

      sharePop.classList.add('is-open');
      var r = btn.getBoundingClientRect();
      var w = sharePop.offsetWidth, h = sharePop.offsetHeight;
      var left = Math.min(window.innerWidth - w - 10, Math.max(10, r.left));
      var top = (r.bottom + 10 + h > window.innerHeight) ? (r.top - h - 10) : (r.bottom + 10);
      sharePop.style.left = left + 'px';
      sharePop.style.top = Math.max(10, top) + 'px';

      var onDoc = function (e) { if (sharePop && !sharePop.contains(e.target) && e.target !== btn) closeSharePop(); };
      var onKey = function (e) { if (e.key === 'Escape') closeSharePop(); };
      var timer = setTimeout(closeSharePop, 9000);
      sharePopCloser = function () {
        clearTimeout(timer);
        document.removeEventListener('click', onDoc, true);
        document.removeEventListener('keydown', onKey, true);
        if (sharePop) sharePop.classList.remove('is-open');
        sharePopCloser = null;
      };
      setTimeout(function () {
        document.addEventListener('click', onDoc, true);
        document.addEventListener('keydown', onKey, true);
      }, 0);
    }
    // Word-of-mouth is how the studio grew: a one-click warm intro a partner can
    // forward to a colleague, pre-composed with the tour link.
    function referIntro() {
      track('anniv_tour_refer', {});
      var url = shareUrl();
      var subject = 'Thought you might find this useful';
      var body = "I've partnered with Integral Ed and thought of you. Here's a look at their work over the last fifteen years:\n\n" + url + "\n";
      window.location.href = 'mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    }
    finaleEl.addEventListener('click', function (e) {
      var act = e.target.getAttribute && e.target.getAttribute('data-act');
      if (act === 'restart') go(0);
      else if (act === 'exit') stop();
      else if (act === 'schedule') track('anniv_tour_schedule', {});   // the <a> then navigates
      else if (act === 'refer') { e.preventDefault(); referIntro(); }
      else if (act === 'share') { e.preventDefault(); shareTour(e.target); }
    });
    breakEl.addEventListener('click', function (e) {
      var act = e.target.getAttribute && e.target.getAttribute('data-act');
      if (act === 'next') go(idx + 1);
      else if (act === 'skip') { var s = STEPS[idx]; track('anniv_tour_skip', { section: s.title }); go(s.skipTo != null ? s.skipTo : idx + 1); }
      else if (act === 'exit') stop();
    });
    // Click a subway line to jump to that service (as elsewhere on the page).
    if (evoWrap) {
      evoWrap.addEventListener('click', function (e) {
        if (!on) return;
        var line = e.target.closest && e.target.closest('.anniv-subway-line[data-evo-id]');
        if (!line) return;
        var id = line.getAttribute('data-evo-id');
        for (var i = 0; i < STEPS.length; i++) {
          if (STEPS[i].kind === 'service' && STEPS[i].evoId === id) { go(i); break; }
        }
      });
    }
    document.addEventListener('keydown', function (e) {
      if (!on) return;
      if (e.key === 'Escape') stop();
      else if (e.key === 'ArrowRight') { e.preventDefault(); idx === STEPS.length - 1 ? stop() : go(idx + 1); }
      else if (e.key === 'ArrowLeft')  { e.preventDefault(); go(idx - 1); }
    });

    // Objectives slide: ticking a checkbox pulses the Next button so it's clear
    // those checks aren't the way forward (they confused some users).
    var pulseT;
    document.addEventListener('change', function (e) {
      if (!on) return;
      var t = e.target;
      if (t && t.classList && t.classList.contains('anniv-check-input') && t.checked) {
        btnNext.classList.add('anniv-tour-next--pulse');
        clearTimeout(pulseT);
        pulseT = setTimeout(function () { btnNext.classList.remove('anniv-tour-next--pulse'); }, 2600);
      }
    });

    var startBtn = $('anniv-tour-start');
    if (startBtn) startBtn.addEventListener('click', function () { start(0); });

    // Any [data-tour-start] element launches the tour (e.g. the closing
    // "View as Tour" link).
    document.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('[data-tour-start]');
      if (t) { e.preventDefault(); start(0); }
    });
    // Closing CTA's "Spread the word" reuses the share action.
    var spreadBtn = document.querySelector('.anniv-cta-box [data-act="spread"]');
    if (spreadBtn) spreadBtn.addEventListener('click', function () { shareTour(spreadBtn); });

    // Auto-start if the URL asks for it (?mode=tour).
    try {
      if (new URL(window.location.href).searchParams.get('mode') === 'tour') start(0);
    } catch (e) {}
  }

  /* ── Team carousel: arrows + overflow state for the horizontal team row ──── */
  function setupTeamCarousel() {
    var row = $('anniv-team');
    if (!row || !row.children.length) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var holder = document.createElement('div');
    holder.className = 'anniv-team-holder';
    row.parentNode.insertBefore(holder, row);
    var prev = document.createElement('button');
    prev.type = 'button'; prev.className = 'anniv-team-arrow anniv-team-arrow--prev';
    prev.setAttribute('aria-label', 'Scroll team left'); prev.innerHTML = '&larr;';
    var next = document.createElement('button');
    next.type = 'button'; next.className = 'anniv-team-arrow anniv-team-arrow--next';
    next.setAttribute('aria-label', 'Scroll team right'); next.innerHTML = '&rarr;';
    holder.appendChild(prev); holder.appendChild(row); holder.appendChild(next);

    function step(dir) {
      row.scrollBy({ left: dir * Math.max(280, row.clientWidth * 0.7), behavior: reduce ? 'auto' : 'smooth' });
    }
    prev.addEventListener('click', function () { step(-1); });
    next.addEventListener('click', function () { step(1); });
    function update() {
      var canScroll = row.scrollWidth - row.clientWidth > 8;
      holder.classList.toggle('has-overflow', canScroll);
      prev.disabled = row.scrollLeft <= 2;
      next.disabled = row.scrollLeft + row.clientWidth >= row.scrollWidth - 2;
    }
    row.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ── Desktop "featured + grid" team: a large featured teammate beside the
     grid of faces. Hover or click a face to feature them. Mobile keeps the
     carousel (CSS shows the feature panel only >= 980px, and the handlers
     no-op below that). ──────────────────────────────────────────────────── */
  function setupTeamFeature() {
    var row = $('anniv-team');
    var holder = row && row.parentNode;
    if (!row || !holder || !row.children.length) return;
    var members = Array.prototype.slice.call(row.querySelectorAll('.anniv-member'));
    if (!members.length) return;
    function txt(el, sel) { var n = el && el.querySelector(sel); return n ? n.textContent.trim() : ''; }

    var stage = document.createElement('div');
    stage.className = 'anniv-team-stage';
    var feature = document.createElement('div');
    feature.className = 'anniv-team-feature';
    feature.setAttribute('aria-live', 'polite');
    feature.innerHTML =
      '<div class="anniv-team-feature-frame"></div>' +
      '<div class="anniv-team-feature-body">' +
        '<span class="anniv-team-feature-badge"></span>' +
        '<h3 class="anniv-team-feature-name"></h3>' +
        '<p class="anniv-team-feature-role"></p>' +
        '<a class="anniv-team-feature-link" href="#" target="_blank" rel="noopener">View profile &rarr;</a>' +
      '</div>';
    holder.parentNode.insertBefore(stage, holder);
    stage.appendChild(feature);
    stage.appendChild(holder);

    var fFrame = feature.querySelector('.anniv-team-feature-frame');
    var fBadge = feature.querySelector('.anniv-team-feature-badge');
    var fName  = feature.querySelector('.anniv-team-feature-name');
    var fRole  = feature.querySelector('.anniv-team-feature-role');
    var fLink  = feature.querySelector('.anniv-team-feature-link');

    function feat(m) {
      members.forEach(function (n) { n.classList.toggle('is-featured', n === m); });
      var photo = m.querySelector('.anniv-member-photo');
      var initials = m.querySelector('.anniv-member-initials');
      fFrame.innerHTML = photo
        ? '<img src="' + esc(photo.getAttribute('src')) + '" alt="' + esc(photo.getAttribute('alt') || '') + '">'
        : '<span class="anniv-member-initials">' + esc(initials ? initials.textContent : '') + '</span>';
      fBadge.textContent = txt(m, '.anniv-member-badge');
      fBadge.style.display = fBadge.textContent ? '' : 'none';
      fName.textContent = txt(m, '.anniv-member-name');
      fRole.textContent = txt(m, '.anniv-member-role');
      var href = m.tagName === 'A' ? m.getAttribute('href') : '';
      if (href) { fLink.href = href; fLink.style.display = ''; }
      else { fLink.style.display = 'none'; }
    }

    function isDesktop() { return window.matchMedia('(min-width: 980px)').matches; }
    members.forEach(function (m) {
      m.addEventListener('mouseenter', function () { if (isDesktop()) feat(m); });
      m.addEventListener('focus', function () { if (isDesktop()) feat(m); });
      m.addEventListener('click', function (e) { if (isDesktop()) { e.preventDefault(); feat(m); } });
    });
    feat(members[0]);
  }

  /* ── Mobile rail: collapse the section nav into a menu icon ──────────────── */
  function setupRailMenu() {
    var rail   = $('anniv-rail');
    var toggle = $('anniv-rail-toggle');
    var panel  = $('anniv-rail-panel');
    if (!rail || !toggle) return;
    function setOpen(open) {
      rail.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close sections menu' : 'Open sections menu');
    }
    toggle.addEventListener('click', function () { setOpen(!rail.classList.contains('is-open')); });
    if (panel) panel.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('a')) setOpen(false);   // chose a section
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && rail.classList.contains('is-open')) setOpen(false);
    });
    document.addEventListener('click', function (e) {
      if (rail.classList.contains('is-open') && !rail.contains(e.target)) setOpen(false);
    });
  }

  function init() {
    buildNameIndex();
    renderHero();
    renderSoWhat();
    renderTimeline();
    renderEvolution();
    renderProjects();
    renderTenure();
    renderTeam();
    renderClients();
    renderServices();
    setupObservers();
    setupScrollSpy();
    setupNamePreviews();
    setupSubway();
    setupEvoSync();
    setupProjectModal();
    setupCelebrate();
    setupAnalytics();
    setupRailMenu();
    setupTeamCarousel();
    setupTeamFeature();
    setupTour();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
