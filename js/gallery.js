/* ═══════════════════════════════════════════════════════════════
   gallery.js — Filtrado de galería y lightbox

   EQUIPO POR CATEGORÍA
   Modifica el objeto GEAR_BY_CATEGORY si cambias de equipo.
   El texto aparece automáticamente en el lightbox de cada foto.
═══════════════════════════════════════════════════════════════ */


/* ─────────────────────────────────────────
   EQUIPO POR CATEGORÍA
   Cambia aquí si actualizas tu equipo.
   Estas cadenas aparecen en el lightbox bajo el título de la foto.
───────────────────────────────────────────── */
const GEAR_BY_CATEGORY = {
  astro:  'ZWO ASI 533 MC Pro · Skywatcher 72ED · Star Adventurer GTI',
  sunset: 'Sony a7IV · Sony FE 200-600mm G OSS',
  macro:  'Sony a7IV · Sony FE 90mm Macro G OSS',
  urban:  'Sony a7IV',
};


/* ─────────────────────────────────────────
   CONTADOR DE FOTOS DE LA GALERÍA
   Cada categoría vive ahora en su propia página
   (astro.html, atardeceres.html, macro.html, urbana.html),
   así que ya no hace falta filtrar por pestañas: el contador
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


/* ─────────────────────────────────────────
   LIGHTBOX
───────────────────────────────────────────── */

/**
 * Abre el lightbox con los datos del item clicado.
 * Se llama desde onclick="openLightbox(this)" en cada .gallery-item
 * @param {HTMLElement} item - El elemento .gallery-item clicado
 */
function openLightbox(item) {
  const lightbox   = document.getElementById('lightbox');
  const titleEl    = document.getElementById('lightbox-title');
  const subEl      = document.getElementById('lightbox-sub');
  const descEl     = document.getElementById('lightbox-desc');
  const gearEl     = document.getElementById('lightbox-gear');
  const phEl       = document.getElementById('lightbox-ph');
  const requestBtn = document.getElementById('lightbox-request');

  /* Idioma actual, usado para elegir las variantes en inglés cuando existen */
  const lang = window.currentLang || 'es';

  /* Título y subtítulo desde los atributos data del item.
     data-title-en / data-sub-en son opcionales: si una foto no los lleva,
     se usa el texto en español como respaldo. */
  const title = (lang === 'en' ? item.dataset.titleEn : item.dataset.title) || item.dataset.title || '';
  const sub   = (lang === 'en' ? item.dataset.subEn   : item.dataset.sub)   || item.dataset.sub   || '';
  const cat   = item.dataset.cat || '';
  const gear  = GEAR_BY_CATEGORY[cat] || '';

  /* Descripción del objeto (bilingüe): data-desc-es / data-desc-en.
     Solo las fotos de astro la llevan por ahora; el resto de categorías
     simplemente no muestran este párrafo. */
  const desc = (lang === 'en' ? item.dataset.descEn : item.dataset.descEs) || '';

  titleEl.innerHTML = title;
  subEl.textContent = sub;
  gearEl.textContent = gear;

  if (descEl) {
    descEl.textContent = desc;
    descEl.hidden = !desc;
  }

  /* Botón "Solicitar este print" → lleva al formulario de contacto
     en index.html con la foto ya preseleccionada en el desplegable.
     Se identifica por data-photo-id (no por el texto del título, para
     que la preselección no dependa de que ambos textos coincidan
     letra a letra). */
  if (requestBtn) {
    const photoId = item.dataset.photoId || '';
    requestBtn.href = 'index.html?photo=' + encodeURIComponent(photoId) + '#contact-form';
  }

  /* Si hay una imagen real dentro del placeholder, mostrarla en el lightbox */
  const existingImg = item.querySelector('.gallery-placeholder img');
  phEl.innerHTML = '';

  if (existingImg) {
    /* Clonar la imagen para el lightbox */
    const img = document.createElement('img');
    img.src = existingImg.src;
    img.alt = existingImg.alt || title;
    phEl.appendChild(img);
    phEl.style.border = 'none';
    phEl.style.background = 'none';
  } else {
    /* Placeholder mientras no hay imagen */
    const lang = window.currentLang || 'es';
    const msg  = lang === 'en' ? 'Preview not available' : 'Vista previa no disponible';
    phEl.innerHTML = `<span style="font-size:11px;letter-spacing:0.1em;color:var(--text-dim)">${msg}</span>`;
    phEl.style.border = '1px solid var(--border)';
    phEl.style.background = 'var(--surface)';
  }

  /* Abrir */
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('lightbox-close').focus();
}

/**
 * Cierra el lightbox.
 * Se llama al hacer click fuera de la imagen o en el botón ×
 * @param {Event|null} e - El evento de click (opcional)
 */
function closeLightbox(e) {
  /* Si se hizo click en el overlay (fondo) o en el botón cerrar */
  if (!e || e.target === document.getElementById('lightbox') || e.currentTarget.id === 'lightbox-close') {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
  }
}


/* ─────────────────────────────────────────
   INICIALIZACIÓN DE GALERÍA
───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  /* Contador inicial */
  updateGalleryCount();

  /* Cerrar lightbox con Escape */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeLightbox({ target: document.getElementById('lightbox') });
    }
  });

  /* Cerrar lightbox al hacer click en el fondo */
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.addEventListener('click', closeLightbox);
  }

  /* Botón de cierre */
  const closeBtn = document.getElementById('lightbox-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }
});
