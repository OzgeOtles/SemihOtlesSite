// Shared, accessible pagination. Each list retains its own selected page.
window.paginateList = (() => {
  const pages = new Map();
  const observers = new WeakMap();
  return (list, selector, { key, size = 8, responsive = false, label = 'Kayıtlar' } = {}) => {
    if (!list) return;
    observers.get(list)?.disconnect();
    list.querySelector(':scope > .pagination')?.remove();
    const items = Array.from(list.querySelectorAll(selector));
    if (!items.length) return;
    const pageSize = () => {
      if (!responsive || !list.clientWidth) return size;
      const columns = getComputedStyle(list).gridTemplateColumns.split(/\s+/).filter(Boolean).length;
      return columns <= 2 ? 8 : columns * 2;
    };
    let currentSize = pageSize();
    let count = Math.ceil(items.length / currentSize);
    const saved = pages.get(key);
    let firstIndex = saved?.firstIndex || 0;
    let page = Math.min(Math.floor(firstIndex / currentSize) + 1, count);
    const nav = document.createElement('nav');
    nav.className = 'pagination';
    nav.setAttribute('aria-label', `${label} sayfaları`);
    list.append(nav);
    function render(focusAction) {
      pages.set(key, {firstIndex});
      items.forEach((item, i) => item.classList.toggle('is-page-hidden', i < (page-1)*currentSize || i >= page*currentSize));
      nav.innerHTML = `<p class="pagination__status" aria-live="polite">${items.length} kayıt · ${(page-1)*currentSize+1}–${Math.min(page*currentSize,items.length)} gösteriliyor</p>${count > 1 ? `<div class="pagination__controls"><button type="button" data-action="prev" ${page===1?'disabled':''} aria-label="Önceki sayfa">‹ Önceki</button><label>Sayfa <select aria-label="${label} sayfası">${Array.from({length:count},(_,i)=>`<option value="${i+1}" ${page===i+1?'selected':''}>${i+1} / ${count}</option>`).join('')}</select></label><button type="button" data-action="next" ${page===count?'disabled':''} aria-label="Sonraki sayfa">Sonraki ›</button></div>` : ''}`;
      if (focusAction) {
        const target = nav.querySelector(`[data-action="${focusAction}"]:not(:disabled)`) || nav.querySelector('select');
        target?.focus({preventScroll:true});
      }
    }
    function move(value, action) {
      page = Math.max(1, Math.min(count, value));
      firstIndex = (page-1)*currentSize;
      render(action);
      // Focus stays on the pager, while the newly displayed records come into view.
      list.scrollIntoView({block:'start',behavior:'instant'});
    }
    nav.addEventListener('click', event => {
      const button = event.target.closest('button[data-action]');
      if (button && !button.disabled) move(page + (button.dataset.action==='next'?1:-1),button.dataset.action);
    });
    nav.addEventListener('change', event => {
      if (event.target.matches('select')) move(Number(event.target.value),'select');
    });
    render();
    if (responsive) {
      const observer = new ResizeObserver(() => {
        if (!list.clientWidth) return;
        const nextSize = pageSize();
        if (nextSize === currentSize) return;
        currentSize = nextSize;
        count = Math.ceil(items.length/currentSize);
        page = Math.min(Math.floor(firstIndex/currentSize)+1,count);
        render();
      });
      observer.observe(list);
      observers.set(list, observer);
    }
  };
})();
