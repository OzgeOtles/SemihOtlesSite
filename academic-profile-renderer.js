// Shared by the static build and browser so the academic profile has one source.
(function () {
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const categories = [
    ['all','Tüm görevler'], ['university','Üniversite ve yönetim'], ['editorial','Editörlük ve yayın kurulları'],
    ['review','Hakemlik ve değerlendirme'], ['network','Bilimsel ağlar ve kurullar']
  ];

  function renderEducation(data) {
    return data.education.map(item => `<li class="academic-step"><span class="academic-step__period">${escape(item.period)}</span><div><h3>${escape(item.title)}</h3><p>${escape(item.organization)}</p></div></li>`).join('');
  }

  function renderInterests(data) {
    return data.interests.map(text => `<span>${escape(text)}</span>`).join('');
  }

  function renderRoles(roles) {
    return roles.map(role => `<article class="career-role"><span class="career-date">${escape(role.period)}</span><h5>${escape(role.title)}</h5><p>${escape(role.organization)}</p></article>`).join('');
  }

  function renderProfile(data) {
    const featured = data.featuredRoleIds.map(id => data.roles.find(role => role.id === id));
    const photoAward = data.awards.find(award => award.image);
    const remaining = data.roles.filter(role => !data.featuredRoleIds.includes(role.id)).sort((a,b)=>Number(b.period.slice(0,4))-Number(a.period.slice(0,4)));
    return `
    <nav class="career-jumps" aria-label="Kariyer bölümleri">
      <a href="#akademik-gorevler">Görevler <span>${data.roles.length}</span></a>
      <a href="#bilimsel-topluluklar">Üyelikler <span>${data.memberships.length}</span></a>
      <a href="#oduller-burslar">Ödüller ve burslar</a>
      <a href="#akademik-projeler">Projeler <span>${data.projects.length}</span></a>
    </nav>
    <div id="akademik-gorevler" class="career-block">
      <div class="career-block__heading"><div><span class="eyebrow">Yönetimden bilimsel değerlendirmeye</span><h3>Akademik ve idari görevler</h3></div><p>Üniversite yönetimi, uluslararası ağlar, yayın kurulları ve hakemlik çalışmaları.</p></div>
      <div class="career-highlights">${featured.map(role => `<article class="career-highlight"><span class="career-date">${escape(role.period)}</span><h4>${escape(role.title)}</h4><p>${escape(role.organization)}</p></article>`).join('')}</div>
      <div class="career-directory"><div class="career-directory__heading"><h4 id="roleListHeading">Diğer görevler</h4><label class="career-search" data-career-control hidden for="roleSearch"><span>Görev veya kurum ara</span><input type="search" id="roleSearch" placeholder="Örn. TÜBİTAK, editör, dekan…" autocomplete="off" /></label></div>
        <div class="career-filters" data-career-control hidden role="group" aria-label="Görev kategorisi">${categories.map(([value,label])=>`<button type="button" data-category="${value}" aria-pressed="${value==='all'}">${label}</button>`).join('')}</div>
        <label class="career-filter-select" data-career-control hidden for="roleCategory">Görev kategorisi<select id="roleCategory">${categories.map(([value,label])=>`<option value="${value}">${label}</option>`).join('')}</select></label>
        <div id="roleList" class="career-role-list">${renderRoles(remaining)}</div>
      </div>
    </div>
    <div id="bilimsel-topluluklar" class="career-block membership-block"><div class="career-block__heading"><div><span class="eyebrow">Bilimsel topluluklar</span><h3>Mesleki ve bilimsel üyelikler</h3></div><p>Gıda bilimi ve mesleki topluluklarla kurulan bağlar.</p></div><ul class="membership-list">${data.memberships.map(item=>`<li>${escape(item.name)}</li>`).join('')}</ul></div>
    <div id="oduller-burslar" class="career-block"><div class="career-block__heading"><div><span class="eyebrow">Ödüller ve destekler</span><h3>Akademik ödüller ve burslar</h3></div><p>Proje önerisi, hizmet, sunum ve makale ödülleri; araştırma ve bilimsel etkinlik bursları.</p></div>
      <div class="award-showcase"><figure class="photo-card award-photo"><a class="photo-link" href="${escape(photoAward.image)}" data-photo data-caption="${escape(photoAward.year)} · ${escape(photoAward.title)} · Gıda Mühendisleri Odası" aria-label="${escape(photoAward.title)} fotoğrafını büyüt"><img src="${escape(photoAward.image)}" width="800" height="1066" alt="${escape(photoAward.year)} yılı ${escape(photoAward.title)} takdiminden bir kare" loading="lazy" decoding="async" /><span class="photo-expand" aria-hidden="true">↗</span></a><figcaption><span>${escape(photoAward.year)} · Gıda Mühendisleri Odası</span><strong>${escape(photoAward.title)}</strong></figcaption></figure>
      <ol class="award-list">${data.awards.map(award=>`<li class="award-entry"><span class="award-year">${escape(award.year)}</span><div><h4>${escape(award.title)}</h4><p>${escape(award.description)}</p>${award.event?`<p class="award-event">${escape(award.event)}</p>`:''}</div></li>`).join('')}</ol></div>
      <div class="fellowship-grid"><section class="fellowship-panel"><span class="career-small-label">Bilimsel etkileşim</span><h4>Seyahat ve çalıştay bursları</h4><ul>${data.scholarships.travel.map(name=>`<li>${escape(name)}</li>`).join('')}</ul></section><section class="fellowship-panel"><span class="career-small-label">Araştırma desteği</span><h4>Araştırma bursları</h4><ul>${data.scholarships.research.map(name=>`<li>${escape(name)}</li>`).join('')}</ul></section></div>
    </div>
    <div id="akademik-projeler" class="career-block"><div class="career-block__heading"><div><span class="eyebrow">Ortak araştırma ve bilgi paylaşımı</span><h3>AB ve diğer önemli projeler</h3></div><p>Erasmus, COST, TÜBİTAK ve uluslararası iş birliği projeleri.</p></div><div id="careerProjects" class="career-project-list">${[...data.projects].sort((a,b)=>Number(b.period?.slice(0,4)||0)-Number(a.period?.slice(0,4)||0)).map(project=>`<article class="career-project"><div class="career-project__meta"><span>${escape(project.programme)}</span>${project.period?`<span>${escape(project.period)}</span>`:''}</div><h4>${escape(project.name)}</h4>${project.code?`<p class="project-code">${escape(project.code)}</p>`:''}</article>`).join('')}</div></div>`;
  }

  const renderer = { renderEducation, renderInterests, renderProfile, renderRoles };
  if (typeof module === 'object' && module.exports) module.exports = renderer;
  else window.academicProfileRenderer = renderer;
})();
