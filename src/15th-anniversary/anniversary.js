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
          ? '<a class="anniv-name" href="' + esc(ref.href) + '"' + attrs + '>' + m + '</a>'
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
        (t.body ? '<p class="anniv-tl-body">' + linkNames(t.body) + '</p>' : '') +
        (t.image ? '<img class="anniv-tl-img" src="' + esc(t.image) + '" alt="' + esc(t.title || '') + '" loading="lazy">' : '') +
        '</li>';
    }).join('');
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
      return '<g class="anniv-subway-line ' + color + '">' +
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

    var legend = '<div class="anniv-evo-list">' + stages.map(function (s) {
      var color = 'evo-' + (s.color || 'plum');
      return '<div class="anniv-evo-row reveal ' + color + '">' +
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
      var metaBits = [p.year, p.serviceArea, p.client].filter(Boolean).map(esc).join(' · ');
      var hasDemo = !!(p.embedUrl || p.videoUrl);
      var ctaLabel = hasDemo ? (p.videoUrl ? 'Watch the demo' : 'Open the demo') : 'See the work';
      var body =
        '<div class="anniv-project-body">' +
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
    var metaBits = [p.year, p.serviceArea, p.client].filter(Boolean).map(esc).join(' · ');
    m.querySelector('.anniv-modal-meta').innerHTML = metaBits;
    m.querySelector('.anniv-modal-title').textContent = p.title;

    var mediaEl = m.querySelector('.anniv-modal-media');
    if (p.embedUrl) {
      mediaEl.innerHTML = '<iframe src="' + esc(p.embedUrl) + '" title="' + esc(p.title) +
        '" loading="lazy" allowfullscreen></iframe>';
      mediaEl.hidden = false;
    } else if (p.videoUrl) {
      mediaEl.innerHTML = '<iframe src="' + esc(p.videoUrl) + '" title="' + esc(p.title) +
        '" loading="lazy" allow="autoplay; fullscreen" allowfullscreen></iframe>';
      mediaEl.hidden = false;
    } else if (p.image) {
      mediaEl.innerHTML = '<img src="' + esc(p.image) + '" alt="' + esc(p.title) + '">';
      mediaEl.hidden = false;
    } else {
      mediaEl.innerHTML = '';
      mediaEl.hidden = true;
    }

    m.querySelector('.anniv-modal-body').innerHTML =
      p.summary ? '<p>' + linkNames(p.summary) + '</p>' : '';

    var dest = p.link || p.href || '';
    var actions = '';
    if (dest) {
      var external = /^https?:/i.test(dest);
      var tgt = external ? ' target="_blank" rel="noopener"' : '';
      var label = (p.link ? 'View the full case study' : 'Explore related work');
      actions = '<a class="anniv-modal-btn" href="' + esc(dest) + '"' + tgt + '>' + label + ' &rarr;</a>';
    }
    m.querySelector('.anniv-modal-actions').innerHTML = actions;

    m.removeAttribute('hidden');
    document.documentElement.classList.add('anniv-modal-open');
    requestAnimationFrame(function () { m.classList.add('is-on'); });
    var closeBtn = m.querySelector('.anniv-modal-close');
    if (closeBtn) closeBtn.focus();
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
          (f.story ? '<p class="anniv-client-story">' + linkNames(f.story) + '</p>' : '') +
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
  function init() {
    buildNameIndex();
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
    setupNamePreviews();
    setupSubway();
    setupProjectModal();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
