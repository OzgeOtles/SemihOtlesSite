const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const { buildStatic, normalizeSiteUrl, defaultSiteUrl } = require('../scripts/build-static.cjs');
const renderer = require('../academic-profile-renderer.js');
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
  for (const name of ['js/yayinlar', 'publication-stats-data.js', 'academic-profile-data.js']) {
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
  assert(!fs.readFileSync(path.join(output, 'index.html'), 'utf8').includes('property="og:url"'));
  assert(!fs.readFileSync(path.join(output, 'index.html'), 'utf8').includes('application/ld+json'));
});

test('production metadata consistently identifies the chosen domain and academic profile', () => {
  const output = buildStatic({ siteUrl: defaultSiteUrl });
  const html = fs.readFileSync(path.join(output, 'index.html'), 'utf8');
  const title = html.match(/<title>([^<]+)<\/title>/)[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/)[1];
  assert.equal(defaultSiteUrl, 'https://www.profdrsemihotles.com.tr/');
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  assert(html.includes(`property="og:url" content="${defaultSiteUrl}"`));
  assert(html.includes(`property="og:title" content="${title}"`));
  assert(html.includes(`name="twitter:description" content="${description.replace(/'/g, '&#39;')}"`));
  assert(html.includes(`property="og:image" content="${defaultSiteUrl}assets/photos/semih-otles-faculty.jpg"`));
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  const person = graph.find(node => node['@type'] === 'Person');
  const profile = graph.find(node => node['@type'] === 'ProfilePage');
  const website = graph.find(node => node['@type'] === 'WebSite');
  assert.equal(person.name, 'Semih Ötleş');
  assert.equal(person.alternateName, 'Semih Otles');
  assert.equal(person.honorificPrefix, 'Prof. Dr.');
  assert.equal(person.sameAs.length, 2);
  for (const url of person.sameAs) assert(html.includes(`href="${url}"`), 'Identity links must also be visible');
  assert.equal(profile.mainEntity['@id'], person['@id']);
  assert.equal(profile.isPartOf['@id'], website['@id']);
  assert.equal(profile.name, title);
  assert.equal(profile.description, description);
  for (const node of graph) assert.equal(node.url, defaultSiteUrl);
  for (const property of ['birthDate', 'email', 'telephone', 'worksFor']) assert(!Object.hasOwn(person, property));
  assert.equal(person.award.length, 6);
  assert(html.includes('<h1>Prof. Dr. Semih Ötleş</h1>'));
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert(html.includes('Profesör Doktor Semih Ötleş'));
  assert(!html.includes('name="keywords"'));
  assert(!html.includes('doktro'));
});

test('all academic records and research interests reach the initial HTML without JavaScript', () => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'academic-profile-data.js'), 'utf8'), context);
  const data = context.window.academicProfileData;
  const output = buildStatic({ siteUrl: defaultSiteUrl });
  const html = fs.readFileSync(path.join(output, 'index.html'), 'utf8');
  const body = html.split('<body>')[1].split('<script src=')[0];
  assert.equal((body.match(/class="career-highlight"/g) || []).length + (body.match(/class="career-role"/g) || []).length, data.roles.length);
  assert.equal((body.match(/class="academic-step"/g) || []).length, data.education.length);
  assert.equal((body.match(/class="career-project"/g) || []).length, data.projects.length);
  assert.equal((body.match(/class="award-entry"/g) || []).length, data.awards.length);
  assert(body.includes(renderer.renderInterests(data)));
  assert(body.includes(renderer.renderEducation(data)));
  assert(body.includes(renderer.renderProfile(data)));
  assert(!body.includes('Resume.doc'));
  assert(!body.includes('is-page-hidden'));
  const artifactScripts = [...html.matchAll(/<script src="([^"]+)"/g)].map(match => match[1].split('?')[0]);
  assert(artifactScripts.indexOf('academic-profile-renderer.js') < artifactScripts.indexOf('academic-profile.js'));
});

test('academic renderer treats data as text when producing indexable HTML', () => {
  const markup = renderer.renderRoles([{ period: '2020', title: '<script>alert(1)</script>', organization: 'A & B' }]);
  assert(!markup.includes('<script>'));
  assert(markup.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
  assert(markup.includes('A &amp; B'));
});

test('reject invalid deployment domains rather than publishing incorrect canonical metadata', () => {
  for (const url of ['http://example.com', 'https://example.com/path', 'https://user@example.com', 'https://example.com/?x=1', 'https://example.com/#section']) {
    assert.throws(() => normalizeSiteUrl(url));
  }
});
