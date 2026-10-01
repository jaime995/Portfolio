/* ═══════════════════════════════════════════════════════════════
   animations.js — GSAP + ScrollTrigger, solo para index.html

   Solo animaciones y transiciones; no cambia contenido ni estructura
   de texto. Si GSAP no llega a cargar (red, bloqueo, etc.) o el
   usuario prefiere movimiento reducido, todo el contenido se queda
   simplemente visible desde el principio — nunca se oculta con CSS
   a la espera de un script que podría no llegar a ejecutarse.

   1. Parallax sutil de la imagen del hero al hacer scroll.
   2. Reveal escalonado (fade + translateY) de "Sobre mí" y las
      tarjetas de equipo (stats) al entrar en el viewport.
   3. Transición suave al entrar cada sección siguiente
      (galería → contacto), a juego con el resto de reveals.
═══════════════════════════════════════════════════════════════ */

(() => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    /* La web funciona igual sin animaciones si el CDN no responde */
    return;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ─────────────────────────────────────────
     1. PARALLAX SUTIL DEL HERO
     querySelectorAll (no solo la primera foto): el hero puede tener
     varias imágenes en crossfade (ver js/hero-rotate.js) y todas
     deben moverse igual, se vea la que se vea en cada momento.
  ───────────────────────────────────────────── */
  const heroImgs = document.querySelectorAll('.hero-bg img');
  if (heroImgs.length) {
    gsap.to(heroImgs, {
      yPercent: 14,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  /* ─────────────────────────────────────────
     2. REVEAL ESCALONADO — SOBRE MÍ Y STATS
  ───────────────────────────────────────────── */
  const aboutTextItems = document.querySelectorAll(
    '.about-text-block .section-label, .about-text-block .about-title, .about-text-block .about-body p'
  );
  if (aboutTextItems.length) {
    gsap.from(aboutTextItems, {
      opacity: 0,
      y: 28,
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: '.about-text-block',
        start: 'top 78%',
      },
    });
  }

  const statCards = document.querySelectorAll('.stat-card');
  if (statCards.length) {
    gsap.from(statCards, {
      opacity: 0,
      y: 28,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.about-stats',
        start: 'top 78%',
      },
    });
  }

  /* ─────────────────────────────────────────
     3. TRANSICIÓN SUAVE ENTRE SECCIONES
     Un reveal discreto (fade + translateY) para el encabezado y el
     contenido de cada sección siguiente, para que el paso de una a
     otra se note como una continuación y no como un corte.
  ───────────────────────────────────────────── */
  gsap.from('.galleries-section .section-header', {
    opacity: 0,
    y: 24,
    duration: 0.7,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.galleries-section',
      start: 'top 80%',
    },
  });

  const galleryCards = document.querySelectorAll('.gallery-card');
  if (galleryCards.length) {
    gsap.from(galleryCards, {
      opacity: 0,
      y: 28,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: '.gallery-cards',
        start: 'top 82%',
      },
    });
  }

  gsap.from('.contact-inner', {
    opacity: 0,
    y: 24,
    duration: 0.7,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.contact',
      start: 'top 78%',
    },
  });

  gsap.from('.print-form-wrap', {
    opacity: 0,
    y: 24,
    duration: 0.7,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.print-form-wrap',
      start: 'top 85%',
    },
  });
})();
