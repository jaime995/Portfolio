/* ═══════════════════════════════════════════════════════════════
   lang.js — Sistema de traducción ES / EN

   Funcionamiento:
   - Todos los elementos traducibles llevan atributos data-es y data-en
   - setLang(lang) recorre todos esos elementos y aplica el texto correcto
   - El idioma activo se guarda en window.currentLang para que gallery.js
     pueda acceder al texto correcto del equipo
═══════════════════════════════════════════════════════════════ */

window.currentLang = 'es';

/**
 * Cambia el idioma de toda la web.
 * @param {string} lang - 'es' o 'en'
 */
function setLang(lang) {
  window.currentLang = lang;

  /* ── Actualizar botones del toggle ── */
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const isActive = btn.textContent.trim().toLowerCase() === lang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive);
  });

  /* ── Traducir todos los elementos con data-es / data-en ── */
  document.querySelectorAll('[data-es]').forEach(el => {
    const translation = el.getAttribute('data-' + lang);
    if (translation) el.innerHTML = translation;
  });

  /* ── Traducir los botones de filtro de galería ── */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    const translation = btn.getAttribute('data-' + lang);
    if (translation) btn.textContent = translation;
  });

  /* ── Actualizar el atributo lang del HTML ── */
  document.documentElement.lang = lang;

  /* ── Actualizar el contador de galería en el idioma correcto ── */
  if (typeof updateGalleryCount === 'function') {
    updateGalleryCount();
  }
}
