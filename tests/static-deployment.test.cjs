const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const { buildStatic, normalizeSiteUrl } = require('../scripts/build-static.cjs');
const root = path.resolve(__dirname, '..');

function listFiles(directory, prefix = '') {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const name = prefix + entry.name;
    return entry.isDirectory() ? listFiles(path.join(directory, entry.name), name + '/') : [name];
  });
}

test('deployment keeps public data and all catalog images, excluding source and temporary files', () => {
  const output = buildStatic({ siteUrl: '' });
  const files = new Set(listFiles(output));
  for (const name of ['index.html', 'js/yayinlar', 'publication-stats-data.js', 'academic-profile-data.js']) {
    assert.equal(fs.readFileSync(path.join(output, name), 'utf8'), fs.readFileSync(path.join(root, name), 'utf8'));
  }
  for (const name of files) {
    assert(!/(?:^|\/)(?:\.|tests|docs|scripts)|\.(?:docx?|xlsx?|md|cjs)$|\.~tmp$|^index\.html[-_]/.test(name), name);
  }
  assert(!files.has('sitemap.xml'));

  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'books-data.js'), 'utf8'), context);
  for (const book of context.window.booksData) assert(files.has(book.image), 'Book cover missing or wrong case: ' + book.image);
  const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  const catalog = app.split('const chapterCatalog = [')[1].split('\n];')[0];
  for (const [, name] of catalog.matchAll(/image: "([^"]+)"/g)) {
    assert(files.has('books/' + name), 'Chapter cover missing or wrong case: ' + name);
  }
  for (const name of ['images/magazine_fx.png', 'images/shadow_fx.png']) assert(files.has(name));
  assert.equal(fs.readFileSync(path.join(output, 'robots.txt'), 'utf8'), 'User-agent: *\nAllow: /\n');
});

test('final domain generates matching canonical URL, sitemap and robots; rebuild removes stale metadata', () => {
  const output = buildStatic({ siteUrl: 'https://profdrsemihotles.com.tr' });
  const html = fs.readFileSync(path.join(output, 'index.html'), 'utf8');
  assert(html.includes('<link rel="canonical" href="https://profdrsemihotles.com.tr/" />'));
  assert(fs.readFileSync(path.join(output, 'sitemap.xml'), 'utf8').includes('<loc>https://profdrsemihotles.com.tr/</loc>'));
  assert(fs.readFileSync(path.join(output, 'robots.txt'), 'utf8').includes('Sitemap: https://profdrsemihotles.com.tr/sitemap.xml'));
  buildStatic({ siteUrl: '' });
  assert(!fs.existsSync(path.join(output, 'sitemap.xml')));
  assert(!fs.readFileSync(path.join(output, 'index.html'), 'utf8').includes('rel="canonical"'));
});

test('reject invalid deployment domains rather than publishing incorrect canonical metadata', () => {
  for (const url of ['http://example.com', 'https://example.com/path', 'https://user@example.com', 'https://example.com/?x=1', 'https://example.com/#section']) {
    assert.throws(() => normalizeSiteUrl(url));
  }
});
