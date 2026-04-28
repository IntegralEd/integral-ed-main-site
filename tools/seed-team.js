#!/usr/bin/env node
/*
 * One-time seeder. Reads the CSV export from Airtable's "IE Public Website Fields"
 * view, parses it into src/team/_data/team.json, and downloads each Proposal_Photo
 * to src/assets/team/<slug>.jpg.
 *
 * Run: node tools/seed-team.js <path-to-csv>
 *
 * After this runs once, the build can use the snapshot when AIRTABLE_* env vars
 * aren't present (local dev). On Netlify with creds set, build-team.js fetches
 * fresh from Airtable.
 */
const fs   = require('fs');
const path = require('path');

const ROOT       = path.resolve(__dirname, '..');
const SNAPSHOT   = path.join(ROOT, 'src/team/_data/team.json');
const PHOTOS_DIR = path.join(ROOT, 'src/assets/team');

const csvPath = process.argv[2];
if (!csvPath) { console.error('Usage: node tools/seed-team.js <csv>'); process.exit(1); }

// ── CSV parser (RFC 4180-ish, handles quoted fields with embedded newlines/commas/escaped-quotes)
function parseCSV(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') { inQuotes = false; }
      else { field += c; }
    } else {
      if (c === '"') { inQuotes = true; }
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else if (c === '\r') { /* skip */ }
      else { field += c; }
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(v => v && v.trim()));
}

// ── Slug: ASCII-fold + lowercase + alphanumeric only (matches "morgantaveras")
function slugify(first, last) {
  return (first + last)
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]/g, '');
}

// ── "filename.jpg (https://...)" → just the URL
function extractUrl(field) {
  const m = field && field.match(/\((https?:\/\/[^)]+)\)/);
  return m ? m[1] : null;
}

// ── Pick file extension from URL or filename, default .jpg
function pickExt(field, url) {
  const fname = (field || '').split(' (')[0];
  const m = (fname.match(/\.(jpe?g|png|gif|webp)$/i) || (url && url.match(/\.(jpe?g|png|gif|webp)(?:\?|$)/i)));
  return m ? '.' + m[1].toLowerCase().replace('jpeg', 'jpg') : '.jpg';
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return buf.length;
}

async function main() {
  const text = fs.readFileSync(csvPath, 'utf8');
  const rows = parseCSV(text);
  const headers = rows[0];
  const idx = (name) => headers.findIndex(h => h.trim() === name);

  const I = {
    first: idx('First Name'),
    last:  idx('Last Name'),
    full:  idx('Full Name'),
    role:  idx('IE_Role_Level'),
    title: idx('Title'),
    photo: idx('Photo'),
    propPhoto: idx('Proposal_Photo'),
    bio:   idx('Professional_Bio (Client Friendly)'),
    quote: idx('EdQuote_Thought'),
    badge: idx('Tenure_Badge_Lookup'),
    tenure: idx('Tenure_N'),
  };
  for (const [k, v] of Object.entries(I)) if (v < 0) throw new Error(`Missing column: ${k}`);

  const records = [];
  const seenSlugs = new Set();
  for (const row of rows.slice(1)) {
    const first = row[I.first].trim();
    const last  = row[I.last].trim();
    if (!first || !last) continue;
    const slug = slugify(first, last);
    if (seenSlugs.has(slug)) throw new Error(`Slug collision: ${slug}`);
    seenSlugs.add(slug);

    const propUrl = extractUrl(row[I.propPhoto]) || extractUrl(row[I.photo]);
    const ext     = pickExt(row[I.propPhoto] || row[I.photo], propUrl);
    const photoFile = slug + ext;

    records.push({
      slug,
      firstName: first,
      lastName:  last,
      fullName:  row[I.full].trim() || `${first} ${last}`,
      roleLevel: row[I.role].trim(),
      title:     row[I.title].trim(),
      photo:     `/assets/team/${photoFile}`,
      bio:       row[I.bio].trim(),
      quote:     row[I.quote].trim(),
      tenureN:   parseInt(row[I.tenure], 10) || 0,
      _sourceUrl: propUrl,
    });
  }

  records.sort((a, b) => a.lastName.localeCompare(b.lastName));

  console.log(`Parsed ${records.length} teammate(s).`);
  console.log('Downloading photos…');
  for (const r of records) {
    if (!r._sourceUrl) { console.warn(`  [skip] ${r.slug} — no photo URL`); continue; }
    const dest = path.join(PHOTOS_DIR, path.basename(r.photo));
    try {
      const bytes = await download(r._sourceUrl, dest);
      console.log(`  ${r.slug.padEnd(22)} ${(bytes / 1024).toFixed(1).padStart(7)} KB`);
    } catch (e) {
      console.error(`  [fail] ${r.slug}: ${e.message}`);
    }
  }

  // Strip _sourceUrl before snapshotting — those signed URLs expire.
  const snapshot = records.map(({ _sourceUrl, ...keep }) => keep);
  fs.writeFileSync(SNAPSHOT, JSON.stringify(snapshot, null, 2) + '\n');
  console.log(`\nWrote ${SNAPSHOT}`);
}

main().catch(e => { console.error(e); process.exit(1); });
