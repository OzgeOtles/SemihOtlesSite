(() => {
  const data = window.publicationStatsData;
  const root = document.getElementById('statsContent');
  if (!data || !root) return;
  const sum = values => values.reduce((a, b) => a + (b ?? 0), 0);
  const rows = data.rows.filter(r => r.values.slice(0, 26).some(v => v !== null));
  const groups = [ ['Kitap, tez ve rapor', 0, 2], ['Araştırma · dergi', 2, 8], ['Araştırma · konferans', 8, 14], ['Derleme · dergi', 14, 20], ['Derleme · konferans', 20, 26] ];
  const categoryTotals = groups.map(([, start, end]) => sum(data.reportedTotals.slice(start, end)));
  const annualRows = rows.filter(r => r.values[29] !== null);
  const lastYear = Math.max(...annualRows.map(r => r.year));
  const firstYear = lastYear - 9;
  root.innerHTML = `
    <p class="stats-intro">Prof. Dr. Semih Ötleş’in yıllara ve yayın türlerine göre akademik üretimi.</p>
    <div class="stats-summary">
      <div class="stats-summary__card"><span>Toplam yayın</span><strong>${data.reportedTotals[29].toLocaleString('tr-TR')}</strong><small>Akademik yayın birikimi</small></div>
      <div class="stats-summary__card"><span>Kitap, tez ve rapor</span><strong>${categoryTotals[0]}</strong><small>Yurt içi ve yurt dışı</small></div>
      <div class="stats-summary__card"><span>Araştırma</span><strong>${categoryTotals[1]+categoryTotals[2]}</strong><small>Dergi ve konferans</small></div>
      <div class="stats-summary__card"><span>Derleme</span><strong>${categoryTotals[3]+categoryTotals[4]}</strong><small>Dergi ve konferans</small></div>
    </div>
    <div class="stats-panels">
      <section class="stats-panel"><h3>Yayın türlerine göre dağılım</h3><p>Bilimsel çalışmaların kapsamı</p><div class="stats-bars">${groups.map(([label],i)=>`<div class="stats-bar"><div><span>${label}</span><strong>${categoryTotals[i]}</strong></div><div class="stats-track" aria-hidden="true"><i style="width:${categoryTotals[i]/Math.max(...categoryTotals)*100}%"></i></div></div>`).join('')}</div></section>
      <section class="stats-panel"><div class="stats-panel-heading"><div><h3>Yıllara göre yayınlar</h3><p>Akademik üretimin zaman içindeki görünümü</p></div><label>Dönem<select id="statsPeriod"><option value="recent">${firstYear}–${lastYear}</option><option value="all">Tüm yıllar</option></select></label></div><div id="statsYears" class="stats-years"></div></section>
    </div>
    <details class="stats-details"><summary>Yıllık yayın tablosunu incele</summary><div class="stats-table-wrap" tabindex="0" role="region" aria-label="Yıllık yayın verileri"><table class="stats-table"><caption>Yıllara ve yayın türlerine göre çalışmalar</caption><thead><tr><th scope="col">Yıl</th>${groups.map(([l])=>`<th scope="col">${l}</th>`).join('')}<th scope="col">Toplam</th></tr></thead><tbody>${rows.map(r=>`<tr><th scope="row">${r.year}</th>${groups.map(([,a,b])=>`<td>${r.values.slice(a,b).every(v=>v===null)?'—':sum(r.values.slice(a,b))}</td>`).join('')}<td>${r.values[29]??'—'}</td></tr>`).join('')}</tbody></table></div></details>`;
  const draw = () => {
    const selected = annualRows.filter(r => document.getElementById('statsPeriod').value !== 'recent' || r.year >= firstYear);
    const max = Math.max(1, ...selected.map(r => r.values[29]));
    document.getElementById('statsYears').innerHTML = selected.map(r => {
      const n = r.values[29];
      return `<div class="stats-year"><span>${r.year}</span><div class="stats-track" aria-hidden="true"><i style="width:${n/max*100}%"></i></div><strong>${n}</strong></div>`;
    }).join('');
  };
  document.getElementById('statsPeriod').addEventListener('change', draw);
  draw();
})();
