/*
 * build-team.js — team page renderer
 *
 * Responsibilities
 *   1. Load teammate records (Airtable if env vars set, else local snapshot).
 *   2. Render gallery card HTML and modal-template HTML for src/team/index.html.
 *   3. Render a standalone /team/<slug>/ page per teammate.
 *
 * Env (set in Netlify):
 *   AIRTABLE_TOKEN         Personal access token, scoped read-only to the base
 *   AIRTABLE_BASE_ID       e.g. appXXXXXXXXXXXXXX
 *   AIRTABLE_TABLE_NAME    Table name or table ID
 *   AIRTABLE_VIEW          (recommended) view name controlling which records publish
 *
 * When env is missing, falls back to src/team/_data/team.json (a snapshot
 * seeded by tools/seed-team.js). When fetch fails AND the snapshot exists,
 * logs a loud warning and uses the snapshot. Builds error only if both fail.
 */

const fs   = require('fs');
const path = require('path');

// ── Slug rule (must match tools/seed-team.js)
function slugify(first, last) {
  return (first + last)
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]/g, '');
}

// ── HTML escape for text interpolated into attributes/content
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ── Tiny markdown: paragraphs + *em* + **strong**.  No raw HTML allowed.
//    Strips zero-width chars and stray escape backslashes commonly seen in the
//    Airtable bio field.
function inlineMd(s) {
  return esc(s)
    .replace(/\\#/g, '#')
    .replace(/​/g, '')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/(^|[\s(])_(.+?)_(?=[\s).,!?]|$)/g, '$1<em>$2</em>');
}

function bioToHtml(bio) {
  if (!bio) return '';
  return bio.split(/\n\s*\n/).map(p => {
    const inner = inlineMd(p.trim().replace(/\n/g, ' '));
    return inner ? `<p>${inner}</p>` : '';
  }).join('\n');
}

// ── Quote pattern from CSV: "<text>"\n##### *— Author*
function quoteToHtml(quote) {
  if (!quote) return '';
  const idx = quote.search(/\n\s*#####\s*/);
  if (idx === -1) {
    return `<blockquote class="team-quote">${inlineMd(quote.trim())}</blockquote>`;
  }
  const text = quote.slice(0, idx).trim();
  const attribution = quote.slice(idx).replace(/\n\s*#####\s*/, '').trim();
  return `<blockquote class="team-quote">${inlineMd(text)}</blockquote>` +
         `<p class="team-attribution">${inlineMd(attribution)}</p>`;
}

// ── Tenure label, e.g. "8 years @ Integral Ed", "1 year @ Integral Ed"
function tenureLabel(n) {
  if (!n || n < 1) return '';
  return `${n} year${n === 1 ? '' : 's'} @ Integral Ed`;
}

// ── Airtable fetch w/ pagination
async function fetchAirtable() {
  const { AIRTABLE_TOKEN, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME, AIRTABLE_VIEW } = process.env;
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) return null;

  const headers = { Authorization: `Bearer ${AIRTABLE_TOKEN}` };
  const base = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;
  const records = [];
  let offset;
  do {
    const params = new URLSearchParams();
    if (AIRTABLE_VIEW) params.set('view', AIRTABLE_VIEW);
    params.set('pageSize', '100');
    if (offset) params.set('offset', offset);
    const res = await fetch(`${base}?${params}`, { headers });
    if (!res.ok) throw new Error(`Airtable HTTP ${res.status}: ${await res.text()}`);
    const json = await res.json();
    records.push(...json.records);
    offset = json.offset;
  } while (offset);
  return records;
}

// ── Map an Airtable record to our internal shape, downloading the photo
function pickAttachmentUrl(field) {
  if (!Array.isArray(field) || !field.length) return null;
  const a = field[0];
  // Prefer a moderate thumbnail to keep build fast.  Airtable's "large" is up to ~1000px.
  return (a.thumbnails && a.thumbnails.large && a.thumbnails.large.url) || a.url;
}

function pickAttachmentExt(field) {
  if (!Array.isArray(field) || !field.length) return '.jpg';
  const a = field[0];
  if (a.type) {
    if (/png/.test(a.type))  return '.png';
    if (/gif/.test(a.type))  return '.gif';
    if (/webp/.test(a.type)) return '.webp';
  }
  const m = (a.filename || '').match(/\.(jpe?g|png|gif|webp)$/i);
  return m ? '.' + m[1].toLowerCase().replace('jpeg', 'jpg') : '.jpg';
}

async function downloadPhoto(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`photo HTTP ${res.status}`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

function airtableToRecords(rawRecords) {
  const records = [];
  const seen = new Set();
  for (const r of rawRecords) {
    const f = r.fields || {};
    const first = (f['First Name'] || '').trim();
    const last  = (f['Last Name']  || '').trim();
    if (!first || !last) continue;
    const slug = slugify(first, last);
    if (seen.has(slug)) throw new Error(`Slug collision in Airtable data: ${slug}`);
    seen.add(slug);

    const attach = f['Proposal_Photo'] || f['Photo'];
    const url = pickAttachmentUrl(attach);
    const ext = pickAttachmentExt(attach);
    const photoFile = slug + ext;

    records.push({
      slug,
      firstName: first,
      lastName:  last,
      fullName:  (f['Full Name'] || `${first} ${last}`).trim(),
      roleLevel: (f['IE_Role_Level'] || '').trim(),
      title:     (f['Title'] || '').trim(),
      photo:     `/assets/team/${photoFile}`,
      bio:       (f['Professional_Bio (Client Friendly)'] || '').trim(),
      quote:     (f['EdQuote_Thought'] || '').trim(),
      tenureN:   parseInt(f['Tenure_N'], 10) || 0,
      _photoUrl: url || null,
    });
  }
  return records;
}

// Late-phase photo sync: must run AFTER build.js's asset-copy step so the freshly
// downloaded Airtable images aren't overwritten by stale ones from src/assets/team.
async function syncPhotos(team, distAssetsDir) {
  const targets = team.filter(m => m._photoUrl);
  if (!targets.length) return;
  fs.mkdirSync(distAssetsDir, { recursive: true });
  console.log(`Downloading ${targets.length} teammate photo(s) from Airtable...`);
  for (const m of targets) {
    const dest = path.join(distAssetsDir, path.basename(m.photo));
    try {
      await downloadPhoto(m._photoUrl, dest);
      console.log(`  ${m.slug}`);
    } catch (e) {
      console.warn(`  [photo-fail] ${m.slug}: ${e.message}`);
    }
  }
}

// ── Public entry: returns sorted team array, sourced from Airtable or snapshot.
//    Photos are NOT downloaded here — call syncPhotos() after asset copy.
async function loadTeam({ srcDir }) {
  const snapshotPath = path.join(srcDir, 'team/_data/team.json');

  let team;
  let source;
  try {
    const raw = await fetchAirtable();
    if (raw) {
      team = airtableToRecords(raw);
      source = 'airtable';
    }
  } catch (e) {
    console.warn(`\n[build-team] Airtable fetch failed: ${e.message}`);
  }

  if (!team) {
    if (!fs.existsSync(snapshotPath)) {
      throw new Error(`build-team: no Airtable creds and no snapshot at ${snapshotPath}`);
    }
    team = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
    source = 'snapshot';
  }

  team.sort((a, b) => a.lastName.localeCompare(b.lastName));
  console.log(`[build-team] loaded ${team.length} teammate(s) from ${source}`);
  return team;
}

// ── Render: gallery card grid (replaces <!-- @team-cards --> in team page)
function renderTeamCards(team) {
  return team.map(m => `
    <article class="team-card" data-slug="${esc(m.slug)}" data-search="${esc((m.fullName + ' ' + m.title).toLowerCase())}">
      <button type="button" class="team-card-trigger" data-member="${esc(m.slug)}" aria-label="Open ${esc(m.fullName)}'s profile">
        <img class="team-photo" src="${esc(m.photo)}" alt="${esc(m.fullName)}" loading="lazy" />
        <h3 class="team-name">${esc(m.fullName)}</h3>
        <p class="team-title">${esc(m.title)}</p>
        ${quoteToHtml(m.quote)}
      </button>
      <button type="button" class="team-card-link" data-slug="${esc(m.slug)}" aria-label="Copy link to ${esc(m.fullName)}'s profile" title="Copy link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
      </button>
    </article>`).join('\n');
}

// ── Render: hidden <template> blocks the modal hydrates from
function renderTeamModals(team) {
  return team.map(m => `
  <template id="tm-${esc(m.slug)}" data-slug="${esc(m.slug)}" data-name="${esc(m.fullName)}">
    <div class="team-detail">
      <img class="team-detail-photo" src="${esc(m.photo)}" alt="${esc(m.fullName)}" />
      <div class="team-detail-meta">
        <h2 class="team-detail-name">${esc(m.fullName)}</h2>
        <p class="team-detail-title">${esc(m.title)}</p>
        ${m.tenureN ? `<p class="team-detail-tenure">${esc(tenureLabel(m.tenureN))}</p>` : ''}
      </div>
      <div class="team-detail-bio">${bioToHtml(m.bio)}</div>
    </div>
  </template>`).join('\n');
}

// ── Render: standalone /team-2026/<slug>/index.html source.  Returned as full HTML
//    with @nav/@footer placeholders intact so build.js's processHtml fills them.
//    NOTE: while /team-2026/ is the staging path, this is the only place to flip
//    the URL pattern when we cut over to /team/.
const TEAM_BASE = '/team-2026/';

function renderStandalone(m, siteUrl) {
  const url = `${siteUrl}${TEAM_BASE}${m.slug}/`;
  const desc = (m.bio || '').replace(/\s+/g, ' ').slice(0, 160);
  const tenure = tenureLabel(m.tenureN);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(m.fullName)} | Integral Ed</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${esc(url)}">

  <meta property="og:type" content="profile">
  <meta property="og:title" content="${esc(m.fullName)} — ${esc(m.title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${esc(url)}">
  <meta property="og:image" content="${esc(siteUrl + m.photo)}">
  <meta name="robots" content="noindex">
  <meta property="profile:first_name" content="${esc(m.firstName)}">
  <meta property="profile:last_name" content="${esc(m.lastName)}">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="icon" type="image/png" sizes="32x32" href="/vendor/integralthemes/assets/brand/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/vendor/integralthemes/assets/brand/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/vendor/integralthemes/assets/brand/apple-touch-icon.png">

  <link rel="stylesheet" href="/vendor/integralthemes/theme/theme.css">
  <link rel="stylesheet" href="/css/site.css">
</head>
<body>

  <!-- @nav -->

  <main>
    <section class="section team-profile-section">
      <div class="container team-profile-container">
        <p class="team-profile-back"><a href="${TEAM_BASE}">&larr; Our Team</a></p>
        <article class="team-profile">
          <img class="team-profile-photo" src="${esc(m.photo)}" alt="${esc(m.fullName)}">
          <header class="team-profile-header">
            <h1>${esc(m.fullName)}</h1>
            <p class="team-profile-title">${esc(m.title)}</p>
            ${tenure ? `<p class="team-profile-tenure">${esc(tenure)}</p>` : ''}
            <button type="button" class="team-profile-copy" data-copy-url="${esc(url)}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              <span>Copy link</span>
            </button>
          </header>
          <div class="team-profile-bio">${bioToHtml(m.bio)}</div>
          ${quoteToHtml(m.quote)}
        </article>
      </div>
    </section>
  </main>

  <!-- @footer -->

  <script src="/js/main.js"></script>
  <script src="/js/team.js"></script>
</body>
</html>
`;
}

module.exports = { loadTeam, syncPhotos, renderTeamCards, renderTeamModals, renderStandalone, slugify };
