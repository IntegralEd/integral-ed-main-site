const fs = require('fs');
const path = require('path');
const { loadTeam, syncPhotos, renderTeamCards, renderTeamModals, renderStandalone } = require('./build-team');

function copyRecursive(src, dest) {
  const items = fs.readdirSync(src);
  items.forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      if (!fs.existsSync(destPath)) fs.mkdirSync(destPath, { recursive: true });
      copyRecursive(srcPath, destPath);
    } else if (stat.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

function deleteRecursive(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach(file => {
      const filePath = path.join(dirPath, file);
      if (fs.statSync(filePath).isDirectory()) deleteRecursive(filePath);
      else fs.unlinkSync(filePath);
    });
    fs.rmdirSync(dirPath);
  }
}

// Find all HTML files in a directory tree, skipping named subdirectories
function findHtmlFiles(dir, baseDir, skip = ['partials', 'data']) {
  baseDir = baseDir || dir;
  const files = [];
  fs.readdirSync(dir).forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (skip.includes(item)) return;
      files.push(...findHtmlFiles(fullPath, baseDir, skip));
    } else if (item.endsWith('.html')) {
      files.push(path.relative(baseDir, fullPath));
    }
  });
  return files;
}

// Process a single HTML file: inject partials, analytics, widget
function processHtml(content, navHtml, footerHtml, analyticsHtml, widgetHtml, siteSlug, extras) {
  if (extras) {
    if (extras.cards  != null) content = content.replace('<!-- @team-cards -->',  extras.cards);
    if (extras.modals != null) content = content.replace('<!-- @team-modals -->', extras.modals);
  }
  if (navHtml)      content = content.replace('<!-- @nav -->', navHtml);
  if (footerHtml)   content = content.replace('<!-- @footer -->', footerHtml);
  if (analyticsHtml) {
    const siteNameScript = `<script>window.IE_SITE_NAME = '${siteSlug}';</script>`;
    content = content.replace('</head>', `${siteNameScript}\n${analyticsHtml}\n</head>`);
  }
  if (widgetHtml)   content = content.replace('</body>', `${widgetHtml}\n</body>`);
  return content;
}

// ─── Main ────────────────────────────────────────────────────────────────────

(async function main() {

console.log('Starting build...\n');

const pkg      = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
const siteSlug = pkg.siteSlug || 'unknown';
const srcDir   = path.join(__dirname, 'src');
const distDir  = path.join(__dirname, 'dist');

console.log(`Site slug: ${siteSlug}\n`);

// Clean dist
if (fs.existsSync(distDir)) {
  console.log('Cleaning dist...');
  deleteRecursive(distDir);
}
fs.mkdirSync(distDir, { recursive: true });
console.log('Created dist\n');

// Load injectable partials
function loadPartial(relPath, label) {
  const fullPath = path.join(__dirname, relPath);
  if (fs.existsSync(fullPath)) {
    console.log(`Loaded ${label}`);
    return fs.readFileSync(fullPath, 'utf8');
  }
  console.log(`Warning: ${label} not found at ${relPath}`);
  return '';
}

const analyticsHtml = loadPartial('vendor/integralthemes/components/analytics.html', 'analytics');
const widgetHtml    = loadPartial('vendor/integralthemes/components/widgets.html',   'chat widget');
const navHtml       = loadPartial('src/partials/nav.html',    'nav partial');
const footerHtml    = loadPartial('src/partials/footer.html', 'footer partial');
console.log('');

// Load team data (Airtable when env present, else snapshot fallback)
console.log('Loading team data...');
const team = await loadTeam({ srcDir });
const teamCardsHtml  = renderTeamCards(team);
const teamModalsHtml = renderTeamModals(team);
console.log('');

// Process HTML pages
console.log('Processing HTML pages...');
const htmlFiles = findHtmlFiles(srcDir);
htmlFiles.forEach(relPath => {
  const srcPath  = path.join(srcDir, relPath);
  const destPath = path.join(distDir, relPath);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  let content = fs.readFileSync(srcPath, 'utf8');
  const extras = relPath === path.join('team-2026', 'index.html')
    ? { cards: teamCardsHtml, modals: teamModalsHtml }
    : null;
  content = processHtml(content, navHtml, footerHtml, analyticsHtml, widgetHtml, siteSlug, extras);
  fs.writeFileSync(destPath, content, 'utf8');
  console.log(`  ${relPath}`);
});

// Generate standalone /team/<slug>/ pages
console.log('\nGenerating teammate pages...');
const siteUrl = 'https://www.integral-ed.com';
team.forEach(member => {
  const html = processHtml(
    renderStandalone(member, siteUrl),
    navHtml, footerHtml, analyticsHtml, widgetHtml, siteSlug, null
  );
  const dir = path.join(distDir, 'team-2026', member.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  console.log(`  team-2026/${member.slug}/`);
});

// Copy CSS
console.log('\nCopying CSS...');
const cssDestDir = path.join(distDir, 'css');
const cssSrcDir  = path.join(srcDir, 'css');
if (!fs.existsSync(cssDestDir)) fs.mkdirSync(cssDestDir, { recursive: true });
if (fs.existsSync(cssSrcDir)) {
  fs.readdirSync(cssSrcDir).filter(f => !f.endsWith('.backup')).forEach(file => {
    fs.copyFileSync(path.join(cssSrcDir, file), path.join(cssDestDir, file));
    console.log(`  css/${file}`);
  });
}

// Copy JS
console.log('\nCopying JS...');
const jsDestDir = path.join(distDir, 'js');
const jsSrcDir  = path.join(srcDir, 'js');
if (!fs.existsSync(jsDestDir)) fs.mkdirSync(jsDestDir, { recursive: true });
if (fs.existsSync(jsSrcDir)) {
  fs.readdirSync(jsSrcDir).forEach(file => {
    fs.copyFileSync(path.join(jsSrcDir, file), path.join(jsDestDir, file));
    console.log(`  js/${file}`);
  });
}

// Copy assets
console.log('\nCopying assets...');
const assetsSrcDir  = path.join(srcDir, 'assets');
const assetsDestDir = path.join(distDir, 'assets');
if (fs.existsSync(assetsSrcDir)) {
  if (!fs.existsSync(assetsDestDir)) fs.mkdirSync(assetsDestDir, { recursive: true });
  copyRecursive(assetsSrcDir, assetsDestDir);
  console.log('  Copied assets/');
} else {
  console.log('  No assets directory');
}

// Copy vendor theme
console.log('\nCopying vendor theme...');
const vendorSrcDir  = path.join(__dirname, 'vendor', 'integralthemes');
const vendorDestDir = path.join(distDir, 'vendor', 'integralthemes');
if (fs.existsSync(vendorSrcDir)) {
  fs.mkdirSync(path.join(distDir, 'vendor'), { recursive: true });
  fs.mkdirSync(vendorDestDir, { recursive: true });
  copyRecursive(vendorSrcDir, vendorDestDir);
  console.log('  vendor/integralthemes/ copied');
} else {
  console.error('  ERROR: vendor/integralthemes not found!');
  process.exit(1);
}

// Late-phase: sync teammate photos AFTER asset copy so Airtable images aren't
// overwritten by stale snapshot copies from src/assets/team.
console.log('');
await syncPhotos(team, path.join(distDir, 'assets/team'));

console.log('\nBuild complete.');
console.log(`Output: ${distDir}\n`);

})().catch(err => { console.error(err); process.exit(1); });
