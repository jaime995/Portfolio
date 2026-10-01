/* ═══════════════════════════════════════════════════════════════
   hero-rotate.js — Crossfade entre varias fotos de fondo del hero

   Solo en index.html. Alterna la clase .is-active entre las
   <img> de .hero-bg cada pocos segundos; el cambio de opacidad lo
   hace el CSS (transition en .hero-bg img). Si solo hay una foto,
   o el usuario prefiere movimiento reducido, no hace nada y la
   primera foto (ya marcada is-active en el HTML) se queda fija.
═══════════════════════════════════════════════════════════════ */

(() => {
  const images = document.querySelectorAll('.hero-bg img');
  if (images.length < 2) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const INTERVAL_MS = 6000;
  let current = 0;

  setInterval(() => {
    const next = (current + 1) % images.length;
    images[current].classList.remove('is-active');
    images[next].classList.add('is-active');
    current = next;
  }, INTERVAL_MS);
})();
