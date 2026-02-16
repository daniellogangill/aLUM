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
   Service modal / lightbox (supports images + PDFs)
   - Home page: elements with [data-modal-img]
   - Case Studies: elements with [data-modal-pdf]
   ========================================================= */
(function () {
  const modal = document.getElementById('serviceModal');
  if (!modal) return;

  const modalImg = document.getElementById('serviceModalImg');
  const modalPdf = document.getElementById('serviceModalPdf');

  // If you forgot to add the iframe to your modal markup,
  // PDFs will not work (images will still work).
  // We won't hard-fail the script; just guard later.
  let lastFocusedEl = null;

  function setOpenState(isOpen) {
    if (isOpen) {
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    } else {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  function openImage(imgSrc, imgAlt) {
    lastFocusedEl = document.activeElement;

    // Hide PDF (if present)
    if (modalPdf) {
      modalPdf.src = '';
      modalPdf.style.display = 'none';
    }

    // Show image
    if (!modalImg) return;
    modalImg.src = imgSrc;
    modalImg.alt = imgAlt || 'Service details';
    modalImg.style.display = 'block';

    setOpenState(true);

    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function openPdf(pdfSrc) {
    lastFocusedEl = document.activeElement;

    // Hide image
    if (modalImg) {
      modalImg.src = '';
      modalImg.alt = '';
      modalImg.style.display = 'none';
    }

    // Show PDF
    if (!modalPdf) return;
    modalPdf.style.display = 'block';
    modalPdf.src = pdfSrc;

    setOpenState(true);

    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    setOpenState(false);

    if (modalImg) {
      modalImg.src = '';
      modalImg.alt = '';
      modalImg.style.display = 'none';
    }

    if (modalPdf) {
      modalPdf.src = '';
      modalPdf.style.display = 'none';
    }

    if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
      lastFocusedEl.focus();
    }
  }

  // Bind Image triggers (homepage)
  document.querySelectorAll('[data-modal-img]').forEach(el => {
    const handler = (e) => {
      // prevent navigation if it’s an <a>
      if (el.tagName.toLowerCase() === 'a') e.preventDefault();

      const src = el.getAttribute('data-modal-img');
      const alt = el.getAttribute('data-modal-alt') || '';
      if (!src) return;

      openImage(src, alt);
    };

    el.addEventListener('click', handler);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handler(e);
      }
    });
  });

  // Bind PDF triggers (case studies)
  document.querySelectorAll('[data-modal-pdf]').forEach(el => {
    const handler = (e) => {
      // prevent navigation if it’s an <a>
      if (el.tagName.toLowerCase() === 'a') e.preventDefault();

      const src = el.getAttribute('data-modal-pdf');
      if (!src) return;

      openPdf(src);
    };

    el.addEventListener('click', handler);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handler(e);
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
