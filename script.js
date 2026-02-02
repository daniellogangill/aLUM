(function(){
  document.querySelectorAll('.carousel').forEach(function(carousel){
    const viewport = carousel.querySelector('.carousel-viewport');
    const prev = carousel.querySelector('.prev');
    const next = carousel.querySelector('.next');
    if(!viewport || !prev || !next) return;

    function updateButtons(){
      const maxScroll = viewport.scrollWidth - viewport.clientWidth;
      prev.disabled = viewport.scrollLeft <= 0;
      next.disabled = viewport.scrollLeft >= maxScroll - 1;
    }

    function scrollByAmount(dir){
      const step = Math.max(320, viewport.clientWidth * 0.6);
      viewport.scrollBy({left: dir*step, behavior:'smooth'});
    }

    prev.addEventListener('click', ()=> scrollByAmount(-1));
    next.addEventListener('click', ()=> scrollByAmount(1));
    viewport.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);

    // Keyboard support
    viewport.setAttribute('tabindex','0');
    viewport.addEventListener('keydown', e=>{
      if(e.key==='ArrowLeft') scrollByAmount(-1);
      if(e.key==='ArrowRight') scrollByAmount(1);
    });

    // Init state
    setTimeout(updateButtons, 0);
  });
})();

/* =========================================================
   Mobile nav / hamburger toggle
   ========================================================= */
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#site-nav');

  if (!toggle || !nav) return;

  function closeMenu() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }

  function openMenu() {
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
  }

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.contains('is-open');
    if (isOpen) closeMenu();
    else openMenu();
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    const clickedInside = nav.contains(e.target) || toggle.contains(e.target);
    if (!clickedInside) closeMenu();
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Close after clicking a link
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => closeMenu());
  });
})();

/* =========================================================
   Service modal / lightbox (for the two service cards)
   ========================================================= */
(function () {
  const modal = document.getElementById('serviceModal');
  const modalImg = document.getElementById('serviceModalImg');
  if (!modal || !modalImg) return;

  const cards = document.querySelectorAll('.service-card[data-modal-img]');
  let lastFocusedEl = null;

  function openModal(imgSrc, imgAlt) {
    lastFocusedEl = document.activeElement;

    modalImg.src = imgSrc;
    modalImg.alt = imgAlt || 'Service details';

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');

    // focus close button
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();

    // prevent background scroll
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');

    modalImg.src = '';
    modalImg.alt = '';

    document.body.style.overflow = '';

    if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
      lastFocusedEl.focus();
    }
  }

  // Open on click + keyboard (Enter/Space)
  cards.forEach(card => {
    card.addEventListener('click', () => {
      openModal(card.dataset.modalImg, card.dataset.modalAlt);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card.dataset.modalImg, card.dataset.modalAlt);
      }
    });
  });

  // Close button
  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Click outside panel closes
  modal.addEventListener('click', (e) => {
    const panel = modal.querySelector('.modal-panel');
    if (panel && !panel.contains(e.target)) closeModal();
  });

  // ESC closes
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
})();
