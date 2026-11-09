const portraitPath = 'assets/photos/semih-otles-faculty.jpg';
const profileUrls = [
  'https://unisis.ege.edu.tr/researcher=semih.otles?menu=education',
  'https://scholar.google.com.tr/citations?user=OrbpzgEAAAAJ',
];

const escapeAttribute = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);

function renderSeo(html, data, canonicalUrl) {
  if (!canonicalUrl) return '';
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  if (!title || !description) throw new Error('The page needs a title and description before generating SEO metadata.');
  const imageUrl = new URL(portraitPath, canonicalUrl).href;
  const personId = canonicalUrl + '#semih-otles';
  const websiteId = canonicalUrl + '#website';
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: canonicalUrl,
        name: 'Prof. Dr. Semih Ötleş',
        alternateName: 'Semih Ötleş',
        inLanguage: 'tr-TR',
        publisher: { '@id': personId },
      },
      {
        '@type': 'ProfilePage',
        '@id': canonicalUrl + '#profil',
        url: canonicalUrl,
        name: title,
        description,
        inLanguage: 'tr-TR',
        isPartOf: { '@id': websiteId },
        mainEntity: { '@id': personId },
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: 'Semih Ötleş',
        alternateName: 'Semih Otles',
        honorificPrefix: 'Prof. Dr.',
        jobTitle: 'Gıda mühendisi ve akademisyen',
        description: 'Gıda kimyası, fonksiyonel gıdalar, enstrümantal gıda analizi ve nanobilim alanlarında çalışan profesör.',
        url: canonicalUrl,
        image: imageUrl,
        alumniOf: { '@type': 'CollegeOrUniversity', name: 'Ege Üniversitesi', url: 'https://ege.edu.tr/' },
        knowsAbout: data.interests,
        knowsLanguage: data.languages,
        sameAs: profileUrls,
        award: data.awards.map(award => `${award.year} · ${award.title}`),
      },
    ],
  };
  const meta = (property, content, attribute = 'property') =>
    `    <meta ${attribute}="${property}" content="${escapeAttribute(content)}" />`;
  // Escaping '<' prevents any future text field from closing the JSON-LD script.
  const json = JSON.stringify(structuredData, null, 2).replace(/</g, '\\u003c');
  return [
    `    <link rel="canonical" href="${escapeAttribute(canonicalUrl)}" />`,
    meta('og:type', 'profile'),
    meta('og:locale', 'tr_TR'),
    meta('og:site_name', 'Prof. Dr. Semih Ötleş'),
    meta('og:title', title),
    meta('og:description', description),
    meta('og:url', canonicalUrl),
    meta('og:image', imageUrl),
    meta('og:image:width', '960'),
    meta('og:image:height', '1200'),
    meta('og:image:alt', 'Prof. Dr. Semih Ötleş’in portresi'),
    meta('profile:first_name', 'Semih'),
    meta('profile:last_name', 'Ötleş'),
    meta('twitter:card', 'summary', 'name'),
    meta('twitter:title', title, 'name'),
    meta('twitter:description', description, 'name'),
    meta('twitter:image', imageUrl, 'name'),
    meta('twitter:image:alt', 'Prof. Dr. Semih Ötleş’in portresi', 'name'),
    `    <script type="application/ld+json">\n${json}\n    </script>`,
  ].join('\n') + '\n';
}

module.exports = { renderSeo };
