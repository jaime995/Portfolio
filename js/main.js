/* ═══════════════════════════════════════════════════════════════
   main.js — Inicialización general de la página

   Contenido:
   1. Año dinámico en el footer
   2. Navbar — fondo al hacer scroll
   3. Fade-in de secciones al hacer scroll (IntersectionObserver)
   4. Formulario de solicitud de prints (preselección + agradecimiento)
   5. Menú hamburguesa en móvil
═══════════════════════════════════════════════════════════════ */


document.addEventListener('DOMContentLoaded', () => {


  /* ─────────────────────────────────────────
     1. AÑO DINÁMICO EN EL FOOTER
     Actualiza automáticamente cada año
  ───────────────────────────────────────────── */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


  /* ─────────────────────────────────────────
     2. NAVBAR — FONDO AL HACER SCROLL
     Añade la clase .scrolled cuando el usuario
     baja más de 60px, activando el backdrop blur
  ───────────────────────────────────────────── */
  const nav = document.getElementById('nav');

  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    };

    /* Escuchar scroll con passive:true para mejor rendimiento */
    window.addEventListener('scroll', onScroll, { passive: true });

    /* Comprobar posición inicial por si se recarga con scroll */
    onScroll();
  }


  /* ─────────────────────────────────────────
     3. FADE-IN DE SECCIONES
     Los elementos con clase .fade-in aparecen
     suavemente al entrar en el viewport.
     La clase .visible se añade cuando el elemento
     es visible (threshold: 10% del elemento)
  ───────────────────────────────────────────── */
  const fadeEls = document.querySelectorAll('.fade-in');

  if (fadeEls.length > 0) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            /* Dejar de observar una vez visible — mejora rendimiento */
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    fadeEls.forEach(el => observer.observe(el));
  }


  /* ─────────────────────────────────────────
     4. FORMULARIO DE SOLICITUD DE PRINTS
     - Si se llega con ?photo=id (desde el botón "Solicitar este
       print" del lightbox), preselecciona esa foto en el desplegable.
       Se identifica por data-photo-id en el <option>, no por el
       texto visible, así que aunque cambies los nombres de las fotos
       la preselección sigue funcionando.
     - Si se llega con ?sent=true (redirección de FormSubmit tras
       enviar), oculta el formulario y muestra el mensaje de gracias.
  ───────────────────────────────────────────── */
  const params = new URLSearchParams(window.location.search);

  const photoParam = params.get('photo');
  if (photoParam) {
    const select = document.getElementById('print-photo');
    if (select) {
      const match = Array.from(select.options).find(
        opt => opt.dataset.photoId === photoParam
      );
      if (match) select.value = match.value;
    }
  }

  if (params.get('sent') === 'true') {
    const form   = document.getElementById('print-form');
    const thanks = document.getElementById('print-thanks');
    if (form && thanks) {
      form.hidden = true;
      thanks.hidden = false;
    }
  }


  /* ─────────────────────────────────────────
     5. MENÚ HAMBURGUESA EN MÓVIL
     Abre/cierra el panel de navegación a pantalla completa.
     Se cierra al pulsar la X, un enlace, o la tecla Escape.
  ───────────────────────────────────────────── */
  const hamburger  = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile-menu');
  const mobileClose = document.getElementById('nav-mobile-close');

  if (hamburger && mobileMenu) {
    const openMobileMenu = () => {
      mobileMenu.classList.add('open');
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    const closeMobileMenu = () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', () => {
      if (mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    if (mobileClose) {
      mobileClose.addEventListener('click', closeMobileMenu);
    }

    /* Cerrar al pulsar cualquier enlace del menú */
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    /* Cerrar con Escape */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMobileMenu();
    });
  }


});
