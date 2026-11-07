const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const output = path.resolve(root, 'dist');
const publicFiles = [
  'index.html',
  'styles.css',
  'food-science-accent.css',
  'books-data.js',
  'pagination.js',
  'academic-profile-data.js',
  'academic-profile.js',
  'food-science-accent.js',
  'app.js',
  'photo-gallery.js',
  'publication-stats-data.js',
  'publication-dashboard.js',
  'js/yayinlar',
];
const imageTypes = new Set(['.jpg', '.jpeg', '.png', '.svg', '.webp', '.avif', '.gif', '.ico']);

function normalizeSiteUrl(value) {
  if (!value) return '';
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password || url.port ||
      url.pathname !== '/' || url.search || url.hash) {
    throw new Error('SITE_URL must be an HTTPS origin, for example https://profdrsemihotles.com.tr');
  }
  return url.origin + '/';
}

function collectImages(directory) {
  const files = [];
  for (const entry of fs.readdirSync(path.join(root, directory), { withFileTypes: true })) {
    const relative = directory + '/' + entry.name;
    if (entry.isSymbolicLink()) throw new Error('Public assets must not be symlinks: ' + relative);
    if (entry.isDirectory()) files.push(...collectImages(relative));
    else if (entry.isFile() && imageTypes.has(path.extname(entry.name).toLowerCase())) files.push(relative);
  }
  return files;
}

function validateReferences(html, files) {
  // A case-sensitive manifest catches mistakes hidden by Windows before Linux deploys.
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const reference = match[1];
    if (/^(?:#|[a-z][a-z\d+.-]*:|\/\/)/i.test(reference)) continue;
    const relative = decodeURIComponent(reference.split(/[?#]/)[0]).replace(/^\.\//, '').replace(/^\//, '');
    if (!files.has(relative)) throw new Error('Missing public asset in index.html: ' + reference);
  }
  if (!files.has('js/yayinlar')) throw new Error('Missing publication archive');
}

function buildStatic({ siteUrl = process.env.SITE_URL || '' } = {}) {
  // Validate before replacing the previous build.
  const canonicalUrl = normalizeSiteUrl(siteUrl);
  const files = [...publicFiles, ...['assets', 'books', 'images'].flatMap(collectImages)];
  let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  validateReferences(html, new Set(files));

  // Only this checkout's generated dist directory may be removed.
  if (path.dirname(output) !== root || path.basename(output) !== 'dist' ||
      (fs.existsSync(output) && fs.lstatSync(output).isSymbolicLink())) {
    throw new Error('Refusing to replace an unsafe build directory');
  }
  fs.rmSync(output, { recursive: true, force: true });
  fs.mkdirSync(output, { recursive: true });
  for (const relative of files) {
    const source = path.join(root, relative);
    if (!fs.lstatSync(source).isFile()) throw new Error('Not a regular public file: ' + relative);
    const destination = path.join(output, relative);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination);
  }

  let robots = 'User-agent: *\nAllow: /\n';
  if (canonicalUrl) {
    html = html.replace('  </head>', `    <link rel="canonical" href="${canonicalUrl}" />\n  </head>`);
    const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      `  <url><loc>${canonicalUrl}</loc></url>\n</urlset>\n`;
    fs.writeFileSync(path.join(output, 'sitemap.xml'), sitemap);
    robots += 'Sitemap: ' + canonicalUrl + 'sitemap.xml\n';
  }
  fs.writeFileSync(path.join(output, 'index.html'), html);
  fs.writeFileSync(path.join(output, 'robots.txt'), robots);
  console.log(`Static site ready: ${files.length + 1 + Number(Boolean(canonicalUrl))} files in dist/`);
  if (!canonicalUrl) console.log('Set SITE_URL after choosing the final domain to generate the canonical URL and sitemap.');
  return output;
}

if (require.main === module) buildStatic();
module.exports = { buildStatic, normalizeSiteUrl };
