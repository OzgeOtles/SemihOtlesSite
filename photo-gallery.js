(() => {
  const viewer = document.getElementById('photoViewer');
  if (!viewer || typeof viewer.showModal !== 'function') return;
  const photos = [...document.querySelectorAll('a[data-photo]')];
  if (!photos.length) return;
  const image = document.getElementById('photoViewerImage');
  const caption = document.getElementById('photoViewerCaption');
  const count = document.getElementById('photoViewerCount');
  let current = 0;
  let trigger;

  function showPhoto(index) {
    current = (index + photos.length) % photos.length;
    const photo = photos[current];
    image.src = photo.href;
    image.alt = photo.querySelector('img').alt;
    caption.textContent = photo.dataset.caption;
    count.textContent = `${current + 1} / ${photos.length}`;
  }

  photos.forEach((photo, index) => {
    photo.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      trigger = photo;
      showPhoto(index);
      viewer.showModal();
      document.body.classList.add('photo-viewer-open');
    });
  });
  document.getElementById('photoPrevious').addEventListener('click', () => showPhoto(current - 1));
  document.getElementById('photoNext').addEventListener('click', () => showPhoto(current + 1));
  viewer.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      showPhoto(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  viewer.addEventListener('click', event => {
    if (event.target !== viewer) return;
    const bounds = viewer.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) viewer.close();
  });
  viewer.addEventListener('close', () => {
    document.body.classList.remove('photo-viewer-open');
    image.removeAttribute('src');
    trigger?.focus({ preventScroll: true });
  });
})();
