(() => {
  const data = window.academicProfileData;
  const renderer = window.academicProfileRenderer;
  const root = document.getElementById('academicProfile');
  if (!data || !renderer || !root) return;
  const remaining = data.roles.filter(role => !data.featuredRoleIds.includes(role.id));
  const education = document.getElementById('academicTimeline');
  if (education && !education.firstElementChild) education.innerHTML = renderer.renderEducation(data);
  const interests = document.getElementById('researchInterests');
  if (interests && !interests.firstElementChild) interests.innerHTML = renderer.renderInterests(data);
  document.getElementById('profileLanguages').textContent = data.languages.join(' / ');
  // The deployed HTML already contains the complete profile. Enhance it in place.
  if (!root.firstElementChild) root.innerHTML = renderer.renderProfile(data);
  root.querySelectorAll('[data-career-control]').forEach(control => { control.hidden = false; });

  const list = document.getElementById('roleList');
  const search = document.getElementById('roleSearch');
  const categorySelect = document.getElementById('roleCategory');
  let category = 'all';
  const normalize = value => value.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i');
  function renderRoles() {
    const query = normalize(search.value.trim());
    const filtered = category!=='all' || query.length>0;
    root.querySelector('.career-highlights').hidden = filtered;
    document.getElementById('roleListHeading').textContent = filtered ? 'Görevler' : 'Diğer görevler';
    const roles = (filtered ? data.roles : remaining).filter(role => (category==='all' || role.category===category) && normalize(`${role.title} ${role.organization} ${role.period}`).includes(query)).sort((a,b)=>Number(b.period.slice(0,4))-Number(a.period.slice(0,4)));
    list.innerHTML = roles.length ? renderer.renderRoles(roles) : '<p class="career-empty" role="status">Bu aramayla eşleşen görev bulunamadı. Başka bir kurum veya görev adı deneyin.</p>';
    if (roles.length) window.paginateList(list,'.career-role',{key:`career-${category}-${query}`,size:6,label:'Akademik görevler'});
  }
  root.querySelector('.career-filters').addEventListener('click', event => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    category = button.dataset.category;
    categorySelect.value = category;
    root.querySelectorAll('[data-category]').forEach(item => item.setAttribute('aria-pressed',String(item===button)));
    renderRoles();
  });
  categorySelect.addEventListener('change', () => {
    category = categorySelect.value;
    root.querySelectorAll('[data-category]').forEach(item => item.setAttribute('aria-pressed',String(item.dataset.category===category)));
    renderRoles();
  });
  search.addEventListener('input',renderRoles);
  renderRoles();
  window.paginateList(document.getElementById('careerProjects'),'.career-project',{key:'career-projects',size:6,label:'Projeler'});
})();
