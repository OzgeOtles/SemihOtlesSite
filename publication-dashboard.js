(() => {
  const source = window.publicationStatsData;
  const root = document.getElementById('statsContent');
  if (!source || !root) return;
  const rows = source.rows.filter(r => r.values[29] !== null);
  const sum = a => a.reduce((s, v) => s + (v ?? 0), 0);
  const fmt = n => n.toLocaleString('tr-TR');
  const languageLabels = ['Türkçe', 'İngilizce', 'Almanca ve diğer diller'];
  const languageClasses = ['turkish', 'english', 'other-language'];
  // B=English KTR, C=Turkish KTR; D:AA repeat Turkish/English/other.
  const languageCounts = (values, from = 0, to = 26) => {
    const result = [0,0,0];
    for (let i = from; i < to; i++) result[i === 0 ? 1 : i === 1 ? 0 : (i-2)%3] += values[i] ?? 0;
    return result;
  };
  const languageChips = counts => `<div class="card-languages" aria-label="Yayın dilleri">${counts.map((n,i)=>`<span title="${languageLabels[i]}"><i class="${languageClasses[i]}-color" aria-hidden="true"></i>${['TR','EN','Diğer'][i]} <b>${fmt(n)}</b></span>`).join('')}</div>`;
  const groups = [['Kitap, tez ve rapor',0,2],['Araştırma · dergi',2,8],['Araştırma · konferans',8,14],['Derleme · dergi',14,20],['Derleme · konferans',20,26]];
  const last = rows.at(-1).year;
  const options = rows.map(r => `<option value="${r.year}">${r.year}</option>`).join('');
  root.innerHTML = `<p class="stats-intro">Yıllar boyunca bilime katkı. Yayınları dönem, tür ve dil dağılımlarıyla keşfedin.</p>
    <div class="dashboard-controls"><div><label for="yearStart">Başlangıç yılı</label><select id="yearStart">${options}</select></div><span aria-hidden="true">—</span><div><label for="yearEnd">Bitiş yılı</label><select id="yearEnd">${options}</select></div><button id="allYears" type="button">Tüm kariyer</button><p id="periodLabel" aria-live="polite"></p></div>
    <div id="dashboardCards" class="stats-summary" aria-live="polite"></div>
    <section class="stats-panel dashboard-timeline"><div class="stats-panel-heading"><div><span class="eyebrow">Zaman içinde</span><h3>Akademik üretimin gelişimi</h3><p id="timelineCaption"></p></div><div class="timeline-controls"><label for="chartBreakdown">Renklendirme</label><select id="chartBreakdown"><option value="type">Yayın türüne göre</option><option value="language">Yayın diline göre</option></select><label for="chartMode">Görünüm</label><select id="chartMode"><option value="annual">Yıllık yayınlar</option><option value="cumulative">Birikimli yayınlar</option></select></div></div><div id="chartKey" class="chart-key"></div><div class="timeline-scroll" tabindex="0" role="region" aria-label="Yıllık yayın grafiği"><div id="timelineColumns" class="timeline-columns"></div></div><p class="chart-scroll-hint">Tüm yılları görmek için grafiği yatay kaydırabilirsiniz.</p><p id="yearDetail" class="year-detail" aria-live="polite">Bir yılın ayrıntılarını görmek için sütununu seçin.</p></section>
    <div class="stats-panels dashboard-distributions"><section class="stats-panel"><span class="eyebrow">Çalışmalar</span><h3>Yayın türleri</h3><div id="typeBars" class="stats-bars"></div></section><section class="stats-panel"><span class="eyebrow">Dil ve yayın yeri</span><h3>Yayınların dağılımı</h3><div id="languageBars" class="stats-bars"></div><h4 class="location-heading">Yurt içi ve yurt dışı</h4><div id="locationBars" class="stats-bars"></div></section></div>
    <details class="stats-details"><summary>Seçilen dönemin yayın tablosu</summary><div class="stats-table-wrap" tabindex="0" role="region" aria-label="Yıllık yayın tablosu"><table class="stats-table"><caption>Yıl ve yayın türüne göre adetler</caption><thead><tr><th scope="col">Yıl</th>${groups.map(([l])=>`<th scope="col">${l}</th>`).join('')}<th scope="col">Toplam</th></tr></thead><tbody id="dashboardTable"></tbody></table></div></details>`;
  const start = document.getElementById('yearStart'), end = document.getElementById('yearEnd'), mode = document.getElementById('chartMode');
  const breakdown = document.getElementById('chartBreakdown');
  end.value = String(last);
  start.value = String(Math.max(rows[0].year, last - 9));
  const categories = r => groups.map(([,a,b]) => sum(r.values.slice(a,b)));
  const bars = (labels, counts, denominator, percentages = false) => labels.map((l,i)=>`<div class="stats-bar"><div><span>${l}</span><strong>${fmt(counts[i])}${percentages ? ` <small>%${(denominator ? counts[i]/denominator*100 : 0).toLocaleString('tr-TR',{maximumFractionDigits:1})}</small>` : ''}</strong></div><div class="stats-track" aria-hidden="true"><i style="width:${counts[i]/Math.max(1,...counts)*100}%"></i></div></div>`).join('');
  function render() {
    const selected = rows.filter(r => r.year >= Number(start.value) && r.year <= Number(end.value));
    const totals = Array.from({length:30},(_,i)=>sum(selected.map(r=>r.values[i])));
    const counts = groups.map(([,a,b])=>sum(totals.slice(a,b)));
    document.getElementById('periodLabel').textContent = `${start.value}–${end.value}${selected.some(r=>r.year===2026) ? ' · 2026 yıl içi veriler' : ''}`;
    document.getElementById('dashboardCards').innerHTML = [['Toplam yayın',totals[29],'Seçilen dönemde',0,26],['Araştırma',counts[1]+counts[2],'Dergi ve konferans',2,14],['Derleme',counts[3]+counts[4],'Dergi ve konferans',14,26],['Kitap, tez ve rapor',counts[0],'Yurt içi ve yurt dışı',0,2]].map(([l,n,note,a,b])=>`<div class="stats-summary__card"><span>${l}</span><strong>${fmt(n)}</strong><small>${note}</small>${languageChips(languageCounts(totals,a,b))}</div>`).join('');
    document.getElementById('typeBars').innerHTML = bars(groups.map(g=>g[0]),counts,totals[29]);
    document.getElementById('languageBars').innerHTML = bars(['Türkçe','İngilizce','Almanca ve diğer diller'],totals.slice(26,29),totals[29],true);
    const abroad = sum([0,2,3,4,8,9,10,14,15,16,20,21,22].map(i=>totals[i]));
    document.getElementById('locationBars').innerHTML = bars(['Yurt içi','Yurt dışı'],[totals[29]-abroad,abroad],totals[29],true);
    let running = [0,0,0];
    const byLanguage = breakdown.value === 'language';
    const labels = byLanguage ? languageLabels : ['Araştırma','Derleme','Kitap, tez ve rapor'];
    const colors = byLanguage ? languageClasses : ['research','review','ktr'];
    document.getElementById('chartKey').innerHTML = labels.map((label,i)=>`<span><i class="${colors[i]}-color" aria-hidden="true"></i>${label}</span>`).join('');
    const series = selected.map(r => {
      const c = categories(r), current = byLanguage ? languageCounts(r.values) : [c[1]+c[2],c[3]+c[4],c[0]];
      running = running.map((v,i)=>v+current[i]);
      return {r, values: mode.value==='annual' ? current : [...running]};
    });
    const max = Math.max(1,...series.map(s=>sum(s.values)));
    document.getElementById('timelineColumns').innerHTML = series.map(({r,values})=>`<button type="button" class="timeline-column" data-year="${r.year}" aria-label="${r.year}: ${fmt(sum(values))} ${mode.value==='annual'?'yayın':'birikimli yayın'}; ${labels.map((l,i)=>`${l}: ${fmt(values[i])}`).join(',')}" title="${r.year} — ${labels.map((l,i)=>`${l}: ${fmt(values[i])}`).join(' / ')}"><span class="column-count">${fmt(sum(values))}</span><span class="column-stack" aria-hidden="true">${values.map((n,i)=>`<i class="${colors[i]}-color" style="height:calc(var(--timeline-height) * ${n/max})"></i>`).join('')}</span><span class="column-year">${r.year}</span></button>`).join('');
    const peak = selected.reduce((best,r)=>r.values[29]>best.values[29]?r:best,selected[0]);
    document.getElementById('timelineCaption').textContent = mode.value==='annual' ? `Bu dönemin en yüksek yayın adedi: ${peak.year} · ${peak.values[29]} yayın` : `${start.value} yılından itibaren seçilen dönemin birikimli toplamı`;
    document.getElementById('yearDetail').textContent = 'Bir yılın ayrıntılarını görmek için sütununu seçin.';
    document.getElementById('dashboardTable').innerHTML = selected.map(r=>`<tr><th scope="row">${r.year}</th>${categories(r).map(n=>`<td>${n}</td>`).join('')}<td>${r.values[29]}</td></tr>`).join('');
  }
  start.addEventListener('change',()=>{if(+start.value>+end.value) end.value=start.value; render();});
  end.addEventListener('change',()=>{if(+end.value<+start.value) start.value=end.value; render();});
  mode.addEventListener('change',render);
  breakdown.addEventListener('change',render);
  document.getElementById('allYears').addEventListener('click',()=>{start.value=String(rows[0].year);end.value=String(last);render();});
  document.getElementById('timelineColumns').addEventListener('click',event=>{
    const button=event.target.closest('[data-year]'); if(!button)return;
    const r=rows.find(r=>r.year===Number(button.dataset.year)), c=categories(r);
    const languages = languageCounts(r.values);
    document.getElementById('yearDetail').textContent=`${r.year} · ${r.values[29]} yayın: ${c[1]+c[2]} araştırma, ${c[3]+c[4]} derleme, ${c[0]} kitap, tez ve rapor. Diller: ${languages.map((n,i)=>`${fmt(n)} ${languageLabels[i]}`).join(', ')}.`;
  });
  render();
})();
