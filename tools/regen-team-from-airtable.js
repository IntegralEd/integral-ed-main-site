#!/usr/bin/env node
/*
 * Regenerate src/team/_data/team.json (and the src/assets/team/ photos) from
 * the live Airtable "Team" table, IE_Public_Website_Fields view.
 *
 * Reuses build-team.js's fetch/mapping so the snapshot shape stays identical
 * to what Netlify builds from. Airtable is the source of truth here — this
 * OVERWRITES the committed snapshot and photos.
 *
 * Credentials: reads the PAT from ../WorkBase/.env.local (AIRTABLE_PAT), which
 * is scoped to this base. Table/view/base are the anniversary/team directory.
 *
 * Run:  node tools/regen-team-from-airtable.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const SNAPSHOT = path.join(SRC, 'team/_data/team.json');
const PHOTOS_DIR = path.join(SRC, 'assets/team');

// ── Credentials + coordinates ────────────────────────────────────────────
const envFile = path.resolve(ROOT, '..', 'WorkBase/.env.local');
const pat = (fs.readFileSync(envFile, 'utf8').match(/^AIRTABLE_PAT=(.*)$/m) || [])[1];
if (!pat) { console.error('No AIRTABLE_PAT in ' + envFile); process.exit(1); }

process.env.AIRTABLE_TOKEN = pat.trim();
process.env.AIRTABLE_BASE_ID = 'apps7roRhnziLR2ou';   // Integral Ed's Team and Task Portal
process.env.AIRTABLE_TABLE_NAME = 'Team';
process.env.AIRTABLE_VIEW = 'IE_Public_Website_Fields';

const { loadTeam, downloadReducedPhoto } = require(path.join(ROOT, 'build-team'));

(async function () {
  const team = await loadTeam({ srcDir: SRC });   // fetches Airtable (env set)
  console.log('\nFetched ' + team.length + ' teammate(s) from Airtable.\n');

  // Refresh photos (reduced to JPEG, same as the Netlify build does).
  fs.mkdirSync(PHOTOS_DIR, { recursive: true });
  for (const m of team) {
    if (!m._photoUrl) { console.warn('  [no photo] ' + m.slug); continue; }
    const dest = path.join(PHOTOS_DIR, path.basename(m.photo));
    try {
      const bytes = await downloadReducedPhoto(m._photoUrl, dest);
      console.log('  ' + m.slug.padEnd(22) + (bytes / 1024).toFixed(0).padStart(6) + ' KB');
    } catch (e) {
      console.error('  [photo-fail] ' + m.slug + ': ' + e.message);
    }
  }

  // Write the snapshot (drop the transient _photoUrl, matching seed shape).
  const snapshot = team.map(({ _photoUrl, ...keep }) => keep);
  fs.writeFileSync(SNAPSHOT, JSON.stringify(snapshot, null, 2) + '\n');
  console.log('\nWrote ' + path.relative(ROOT, SNAPSHOT) + ' (' + snapshot.length + ' records)\n');
})().catch(e => { console.error(e); process.exit(1); });
