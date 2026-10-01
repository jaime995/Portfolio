/* ═══════════════════════════════════════════════════════════════
   gallery.js — Contador de fotos y equipo por categoría

   El lightbox (zoom, swipe, pinch, contador y captions) lo gestiona
   ahora PhotoSwipe, inicializado desde js/pswp-init.js. Este archivo
   solo se encarga de:
   - GEAR_BY_CATEGORY: el texto de equipo que aparece en la caption
     de cada foto (pswp-init.js lo lee vía window.GEAR_BY_CATEGORY).
   - El contador "— N fotos" de cada página de galería.
═══════════════════════════════════════════════════════════════ */


/* ─────────────────────────────────────────
   EQUIPO POR CATEGORÍA
   Cambia aquí si actualizas tu equipo.
   Este texto aparece en la caption de PhotoSwipe, bajo el título.
───────────────────────────────────────────── */
const GEAR_BY_CATEGORY = {
  astro:  'ZWO ASI 533 MC Pro · Skywatcher 72ED · Star Adventurer GTI',
  sunset: 'Sony a7IV · Sony FE 200-600mm G OSS',
  macro:  'Sony a7IV · Sony FE 90mm Macro G OSS',
  urban:  'Sony a7IV',
};

/* Hacer GEAR_BY_CATEGORY accesible desde js/pswp-init.js */
window.GEAR_BY_CATEGORY = GEAR_BY_CATEGORY;


/* ─────────────────────────────────────────
   CONTADOR DE FOTOS DE LA GALERÍA
   Cada categoría vive en su propia página
   (astro.html, atardeceres.html, macro.html), así que el contador
   simplemente cuenta todos los .gallery-item de la página actual.
───────────────────────────────────────────── */

/**
 * Actualiza el contador de imágenes en el idioma actual.
 * Exportado a window para que lang.js pueda llamarlo.
 */
function updateGalleryCount() {
  const visible = document.querySelectorAll('.gallery-item').length;
  const label = window.currentLang === 'en'
    ? `— ${visible} image${visible !== 1 ? 's' : ''}`
    : `— ${visible} imagen${visible !== 1 ? 'es' : ''}`;

  const counter = document.getElementById('gallery-count');
  if (counter) counter.textContent = label;
}

/* Hacer updateGalleryCount accesible desde lang.js */
window.updateGalleryCount = updateGalleryCount;

document.addEventListener('DOMContentLoaded', () => {
  updateGalleryCount();
});
