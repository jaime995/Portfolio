/* ═══════════════════════════════════════════════════════════════
   main.js — Inicialización general de la página

   Contenido:
   1. Año dinámico en el footer
   2. Navbar — fondo al hacer scroll
   3. Fade-in de secciones al hacer scroll (IntersectionObserver)
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


});
