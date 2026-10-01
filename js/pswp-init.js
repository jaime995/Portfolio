/* ═══════════════════════════════════════════════════════════════
   pswp-init.js — Lightbox de galería con PhotoSwipe v5 (vía CDN)

   Usa los builds UMD de PhotoSwipe (window.PhotoSwipeLightbox /
   window.PhotoSwipe), cargados como <script> normales en el <head>
   de cada página de galería — NO como módulos ES con import()
   dinámico. Esto es intencional: un import() dinámico puede fallar
   en silencio si la página se abre como archivo local (file://) en
   vez de servida por http(s), y si falla, el <a> de la foto se
   comporta como un enlace normal y navega a la imagen a pantalla
   completa en vez de abrir el lightbox. Con <script> clásico esto
   no puede pasar.

   PhotoSwipe se encarga de zoom táctil/pinch, swipe entre fotos,
   transición imagen-a-imagen, gestos móviles Y el contador "X / Y"
   (viene incluido de serie en su UI, con name: 'counter' — por eso
   NO lo registramos aquí también: hacerlo duplicaba el contador,
   ver .pswp__counter en style.css para su estilo).

   Añadimos encima, con la API de UI de PhotoSwipe:
   - Una caption propia con título, subtítulo, descripción (solo
     astro), equipo y el botón "Solicitar este print" — construida a
     partir de los mismos data-* que ya llevaba cada .gallery-item,
     así que no hay que duplicar ningún texto.

   La caption se re-renderiza si el idioma cambia mientras el
   lightbox está abierto (evento 'langchange' disparado desde
   js/lang.js).
═══════════════════════════════════════════════════════════════ */

(() => {
  if (typeof PhotoSwipeLightbox === 'undefined' || typeof PhotoSwipe === 'undefined') {
    /* Si el CDN de PhotoSwipe no ha llegado a cargar, no hacemos nada:
       las fotos seguirán siendo enlaces normales a la imagen a tamaño
       completo (peor que el lightbox, pero mejor que un error de JS). */
    return;
  }

  /**
   * Construye el HTML de la caption a partir de los data-* del
   * .gallery-item al que pertenece el <a class="pswp-item"> clicado.
   * @param {HTMLElement} anchorEl - el <a class="pswp-item"> de la slide actual
   */
  function buildCaptionHTML(anchorEl) {
    const item = anchorEl.closest('.gallery-item');
    if (!item) return '';

    const lang = window.currentLang || 'es';

    const title = (lang === 'en' ? item.dataset.titleEn : item.dataset.title) || item.dataset.title || '';
    const sub   = (lang === 'en' ? item.dataset.subEn   : item.dataset.sub)   || item.dataset.sub   || '';
    const desc  = (lang === 'en' ? item.dataset.descEn  : item.dataset.descEs) || '';
    const cat   = item.dataset.cat || '';
    const gear  = (window.GEAR_BY_CATEGORY && window.GEAR_BY_CATEGORY[cat]) || '';
    const photoId = item.dataset.photoId || '';
    const requestLabel = lang === 'en' ? 'Request this print' : 'Solicitar este print';

    return `
      <div class="pswp-caption-inner">
        <h3 class="pswp-caption-title">${title}</h3>
        ${sub ? `<p class="pswp-caption-sub">${sub}</p>` : ''}
        ${desc ? `<p class="pswp-caption-desc">${desc}</p>` : ''}
        ${gear ? `<p class="pswp-caption-gear">${gear}</p>` : ''}
        <a class="pswp-caption-request" href="index.html?photo=${encodeURIComponent(photoId)}#contact-form">${requestLabel}</a>
      </div>
    `;
  }

  const lightbox = new PhotoSwipeLightbox({
    gallery: '#gallery-grid',
    children: 'a.pswp-item',
    pswpModule: PhotoSwipe,
    bgOpacity: 1,
    showHideAnimationType: 'fade',
  });

  let captionEl = null;

  lightbox.on('uiRegister', () => {
    /* Caption propia: título + sub + desc + equipo + "Solicitar print".
       Colapsada por defecto (solo título) para no tapar la foto ni
       interferir con el swipe en móvil; un toque la expande. */
    lightbox.pswp.ui.registerElement({
      name: 'custom-caption',
      order: 9,
      isButton: false,
      appendTo: 'root',
      html: '',
      onInit: (el, pswp) => {
        captionEl = el;
        el.classList.add('pswp-caption');
        el.addEventListener('click', (e) => {
          // No expandir/colapsar si se pulsa el propio enlace de print
          if (e.target.closest('.pswp-caption-request')) return;
          el.classList.toggle('pswp-caption-expanded');
        });

        const render = () => {
          const currAnchor = pswp.currSlide && pswp.currSlide.data && pswp.currSlide.data.element;
          el.innerHTML = currAnchor ? buildCaptionHTML(currAnchor) : '';
          el.classList.remove('pswp-caption-expanded');
        };

        pswp.on('change', render);
        pswp.on('afterInit', render);
      },
    });
  });

  /* Si el idioma cambia mientras el lightbox está abierto, refrescar
     la caption visible sin cerrar ni reiniciar la slide actual. */
  document.addEventListener('langchange', () => {
    if (!lightbox.pswp || !captionEl) return;
    const pswp = lightbox.pswp;
    const currAnchor = pswp.currSlide && pswp.currSlide.data && pswp.currSlide.data.element;
    captionEl.innerHTML = currAnchor ? buildCaptionHTML(currAnchor) : '';
  });

  lightbox.init();
})();
