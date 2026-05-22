/* =========================================================================
   Catálogo HP Templados × Saint-Gobain · app.js
   Data + render: necesidades, familias, filtros, comparador, drawer.
   ========================================================================= */
(function() {
  'use strict';
  const productos = window.PRODUCTOS || [];

  function track(event, params) {
    if (typeof gtag === 'function') gtag('event', event, params || {});
  }

  // ----- Familias (descripción comercial + cuándo elegir) -----
  const FAMILIAS = [
    { name: 'Cool-Lite ST',       blurb: 'Vidrios monolíticos con capa de control solar magnetrónica. Catorce variantes en tres colores (neutro, gris, verde) y cinco niveles de rechazo solar.', when: 'Fachadas comerciales monolíticas con sol fuerte donde el DGU no es factible.' },
    { name: 'Cool-Lite KNT',      blurb: 'DGU low-E con control solar, capa cara #2. Aislamiento térmico premium con alta selectividad luminosa.', when: 'Edificios con exigencia energética doble (calor + frío) y certificación.' },
    { name: 'Cool-Lite KS',       blurb: 'DGU premium de alta reflexión (aspecto espejo) y máximo desempeño térmico. Selectividad clase mundial.', when: 'Torres corporativas que quieren estética de alta gama reflectiva con U≤1.7.' },
    { name: 'Cool-Lite SKN',      blurb: 'DGU neutro, selectividad hasta 2.00. La máxima entrada de luz con el mejor control solar de su categoría.', when: 'Fachadas neutras que quieren ser luminosas sin sacrificar eficiencia energética.' },
    { name: 'Cool-Lite Xtreme',   blurb: 'Selectividad >2.0 con tecnología magnetrónica de última generación. Versiones Diamant para máxima neutralidad cromática.', when: 'Proyectos LEED/BREEAM o residencias de lujo donde el desempeño no se negocia.' },
    { name: 'EVO',                blurb: 'Línea residencial de control solar: monolíticos (50, 67, Blue) y DGU (Duo, Duo Max). Punto de entrada accesible.', when: 'Casas y locales que quieren reducir calor sin oscurecer y sin precio premium.' },
    { name: 'Parsol',             blurb: 'Vidrio tintado en masa: gris, verde, bronce y variantes intensas (Gris+, Verde+). Base universal para procesos.', when: 'Acristalamientos económicos o como base para temple/laminado/capas.' },
    { name: 'Sol-Lite',           blurb: 'Vidrios reflectivos monolíticos con privacidad diurna. Tres colores (claro, verde, gris) con efecto espejo.', when: 'Casas que quieren privacidad de día sin oscurecer el interior.' },
    { name: 'Stadip',             blurb: 'Laminados de seguridad con PVB. Variantes Protect (impacto humano) y Silence (acústico).', when: 'Barandales, tragaluces, ventanas frente a avenidas o aeropuertos.' },
    { name: 'Flotado / Base',     blurb: 'Vidrio base de calidad óptica: Planilux (estándar) y Diamant (extra-claro, sin tinte verde).', when: 'Cuando el vidrio es solo soporte o cuando la pureza del color es crítica.' },
    { name: 'Funcional / Bajo Mantenimiento', blurb: 'Bioclean (auto-limpiante con fotocatálisis) y Timeless (anti-cal en mamparas de ducha).', when: 'Fachadas altas inaccesibles, domos, o canceles de baño residenciales.' },
    { name: 'Industrial / Electrodoméstico', blurb: 'Crystal Gold (capa dorada para hornos) y Eko Vision+ (low-E para puertas de horno).', when: 'OEM de electrodomésticos: estufas, hornos premium.' },
    { name: 'Industrial / Refrigeración', blurb: 'Eko Energy: vidrio calefactable (TCO) para puertas de refrigerador comercial sin condensación.', when: 'Supermercados, vitrinas refrigeradas, cámaras frías.' },
    { name: 'Espejos',            blurb: 'Miralite Revolution (sin plomo/cobre), Black (negro brillante), Illuminia (LED) y Mirastar (espejo templable).', when: 'Lobbies, baños, fachadas tipo espejo y mamparas de ducha.' },
    { name: 'Low-E / Refrigeración', blurb: 'Planitherm ONE y UN II: capa low-E que reduce 17-20% el consumo de refrigeración comercial.', when: 'Componente DGU/TGU para refrigeradores y congeladores de tienda.' },
    { name: 'Decorativo / Satinado', blurb: 'Satinovo 1C (una cara) y Duo (ambas caras) — privacidad con luz difusa, sin huellas.', when: 'Puertas, divisiones, mobiliario y cabinas de ducha modernas.' },
  ];

  // ----- 8 tarjetas de necesidad -----
  const NEEDS = [
    { n: '01', title: 'Bajar el calor en una fachada con sol fuerte.', body: 'Torre comercial, edificio industrial, hotel. Lo que importa es g≤0.30 y selectividad alta.', families: ['Cool-Lite ST', 'Cool-Lite Xtreme'], pitch: 'Empieza por Cool-Lite ST si va monolítico, salta a Xtreme si va DGU.' },
    { n: '02', title: 'Oficina con vista afuera sin deslumbramiento.', body: 'TL alto + control solar + bajo U. El espacio se siente abierto pero no se sobrecalienta.', families: ['Cool-Lite KNT', 'Cool-Lite SKN', 'EVO'], pitch: 'KNT/SKN si va corporativo, EVO Duo Max si es residencial premium.' },
    { n: '03', title: 'Casa donde quiero ver afuera sin que me vean.', body: 'Privacidad diurna por reflexión exterior. Sin DGU obligatorio.', families: ['Sol-Lite', 'Parsol'], pitch: 'Sol-Lite si quieres efecto espejo; Parsol tintado si solo necesitas oscurecer.' },
    { n: '04', title: 'Seguridad anti-impacto, anti-caída.', body: 'Barandales, tragaluces, escaleras de vidrio, balcones. Exige laminado clase 1B1.', families: ['Stadip'], pitch: 'STADIP PROTECT cumple norma de impacto humano. Obligatorio en muchos códigos.' },
    { n: '05', title: 'Aislamiento acústico en zona ruidosa.', body: 'Avenida, aeropuerto, hospital, estudio de grabación. Atenuar frecuencias específicas.', families: ['Stadip'], pitch: 'STADIP SILENCE con PVB viscoelástico. Igual aspecto, mejor STC.' },
    { n: '06', title: 'Privacidad y decoración sin perder luz.', body: 'Mamparas, divisiones, puertas, mobiliario. Luz difusa, sin huellas.', families: ['Decorativo / Satinado', 'Espejos'], pitch: 'Satinovo para difusión, Miralite si va con LED retroiluminado.' },
    { n: '07', title: 'Refrigeradores, vitrinas, cámaras frías.', body: 'Sin condensación, máxima visibilidad del producto, ahorro eléctrico.', families: ['Industrial / Refrigeración', 'Low-E / Refrigeración'], pitch: 'Eko Energy + Planitherm ONE en DGU reduce hasta 20% del consumo.' },
    { n: '08', title: 'Espejos arquitectónicos o fachadas tipo espejo.', body: 'Lobbies, ascensores, baños, fachadas reflectivas exteriores.', families: ['Espejos', 'Cool-Lite KS'], pitch: 'Mirastar para mampara templada; KS si la fachada exterior pide aspecto espejo.' },
  ];

  // ----- Glosario · plain-language + ejemplos -----
  const GLOSARIO = [
    {
      key: 'tl', t: 'TL · Transmisión luminosa',
      short: 'Cuánta luz natural deja entrar',
      d: 'El porcentaje de luz visible que cruza el vidrio. Alto = el espacio se siente luminoso sin prender lámparas durante el día. Bajo = penumbra constante.',
      ex: '<strong>70%</strong> de TL = oficina luminosa en CDMX hasta el atardecer. <strong>30%</strong> de TL = boutique con ambientación oscura. Por debajo de 20% el espacio pide luz artificial todo el día.',
      scale: 'Rango típico: 10% – 80%'
    },
    {
      key: 'shgc', t: 'SHGC / g · Ganancia solar',
      short: 'Cuánto calor del sol entra',
      d: 'La fracción de energía solar que cruza el vidrio y calienta el interior. Bajo = menos trabajo para el aire acondicionado. En México el SHGC importa más que el U-Value en la mayoría de proyectos.',
      ex: 'Un vidrio simple claro tiene <strong>SHGC 0.82</strong> — entra el 82% del calor del sol. Un Cool-Lite ST 120 baja a <strong>0.21</strong>: 4 veces menos calor con luz parecida. En GDL con sol poniente, busca SHGC ≤ 0.30.',
      scale: 'Rango: 0.15 (mejor) – 0.85 (peor)'
    },
    {
      key: 'u', t: 'U-Value · Aislamiento térmico',
      short: 'Qué tan rápido escapa o entra calor',
      d: 'La conductancia térmica del vidrio (W/m²·K). Bajo = mejor aislamiento, clima interior estable, menos consumo de aire y calefacción. El DGU (doble vidrio) baja drásticamente el U-Value.',
      ex: 'Vidrio simple = <strong>U 5.7</strong> (la pared escapa calor como un colador). Un DGU básico = <strong>U 2.7</strong>. Un DGU con low-E llega a <strong>U 1.1</strong> — comparable a un muro mal aislado. En MTY con frío de invierno, conviene U ≤ 1.8.',
      scale: 'Rango: 1.0 (mejor) – 5.8 (peor)'
    },
    {
      key: 'sel', t: 'Selectividad · TL / SHGC',
      short: 'Cuántas veces más luz que calor',
      d: 'La relación entre luz visible y calor solar que deja pasar. Mayor a 1 significa que el vidrio es "moderno" — entra más luz que calor. Es la métrica que separa un vidrio comercial de uno de gama alta.',
      ex: 'Un Parsol gris = <strong>0.96</strong> (entra parejo luz y calor). Un Cool-Lite SKN 154 II = <strong>2.14</strong> (entra más del doble de luz que de calor). Por arriba de 2.0 ya es estado del arte mundial.',
      scale: 'Rango: 0.5 – 2.3'
    },
    {
      key: 'ref', t: 'Reflexión exterior',
      short: 'Qué tan espejo se ve de afuera',
      d: 'El porcentaje de luz que rebota hacia la calle. Alta = aspecto espejo, privacidad de día. Baja = el vidrio se ve transparente y neutro desde afuera.',
      ex: '<strong>10%</strong> = vidrio transparente normal. <strong>28%</strong> ya se ve claramente como espejo desde la calle (ideal para casa que da a banqueta). <strong>40%+</strong> = espejo evidente — torres corporativas estilo "lente de sol".',
      scale: 'Rango: 8% – 45%'
    },
    {
      key: 'sc', t: 'SC · Coeficiente de sombra',
      short: 'Métrica antigua de calor solar',
      d: 'Equivalente histórico del SHGC. Algunos fabricantes y normas viejas todavía la reportan. SC ≈ SHGC × 1.15.',
      ex: 'Un SHGC de <strong>0.30</strong> equivale a SC <strong>0.35</strong>. Si tu cliente pregunta por SC, divide entre 1.15 para tener SHGC.',
      scale: 'Rango: 0.2 – 1.0'
    },
    {
      key: 'dgu', t: 'DGU · Double Glazed Unit',
      short: 'Doble vidrio con cámara de aire',
      d: 'Dos vidrios separados por una cámara con aire seco o argón. Es la diferencia entre una ventana eficiente y un colador térmico. Mejora drásticamente U-Value y aislamiento acústico.',
      ex: 'Un DGU 6mm + 12mm aire + 6mm baja el U-Value de 5.7 a 2.7. Si le agregas low-E en cara #2, llega a 1.1. Costo: 35–50% más que monolítico, ahorro: 30–50% en consumo eléctrico.',
      scale: ''
    },
    {
      key: 'templado', t: 'Templado',
      short: 'Vidrio 4–5× más resistente',
      d: 'Tratamiento térmico que aumenta la resistencia mecánica del vidrio. Si rompe, lo hace en granos pequeños no cortantes. Obligatorio en puertas, ventanas grandes, baños y todo lo que pueda golpearse.',
      ex: 'Un vidrio simple aguanta 50 MPa antes de romper. Templado aguanta 240 MPa. Norma NMX-R-072 lo exige en áreas peatonales y aplicaciones de seguridad.',
      scale: ''
    },
    {
      key: 'laminado', t: 'Laminado',
      short: 'Dos vidrios con película adhesiva',
      d: 'Dos o más hojas de vidrio unidas por una película plástica (PVB). En rotura, los fragmentos quedan adheridos a la película — no caen. Es lo que hace seguro un barandal de vidrio o un tragaluz.',
      ex: 'Un Stadip Protect 33.1 = dos vidrios de 3mm + PVB. Pasa la norma EN12600 1B1 de impacto humano. Obligatorio en barandales según muchos códigos de construcción mexicanos.',
      scale: ''
    },
    {
      key: 'lowe', t: 'Low-E',
      short: 'Capa que refleja calor sin oscurecer',
      d: 'Capa metálica microscópica (plata, óxidos) que refleja calor infrarrojo pero deja pasar la luz visible. Es lo que vuelve "inteligente" a un vidrio moderno frente a uno simple.',
      ex: 'Cool-Lite, EVO, Planitherm son familias low-E. Reducen el SHGC sin oscurecer el espacio. Aplicación: cara #2 del DGU (interior del primer vidrio) para fachadas; cara #3 si el clima dominante es frío.',
      scale: ''
    },
  ];
  const GLOSS_BY_KEY = Object.fromEntries(GLOSARIO.map(g => [g.key, g]));

  // ----- Estado -----
  const state = {
    search: '',
    familias: new Set(),
    colores: new Set(),
    segmento: new Set(),
    cap: new Set(),         // capacidades: templable, laminable, dgu
    sortBy: 'familia',
    compare: [],            // hasta 3 productos por slug+nombre
    expanded: new Set(),    // familias abiertas
  };

  // ----- Render helpers -----
  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const fmt = (v, suffix='', dash='—') => v === null || v === undefined || v === '' || v === 'N/D' ? dash : (typeof v === 'number' ? v + suffix : v);
  const pct = v => v === null || v === undefined || v === '' || v === 'N/D' ? '—' : (typeof v === 'number' ? v + '%' : v);
  const norm = s => (s || '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Color para chip visual del producto
  const COLOR_CHIPS = {
    'Neutro': '#9AA6BD',
    'Gris': '#6B7280',
    'Verde': '#5C8C6B',
    'Bronce': '#9C7A4E',
    'Azul': '#3E5BAE',
    'Incoloro / Claro': '#E4EAF2',
    'Extra-claro (incoloro neutro)': '#EEF3FA',
    'Gris intenso': '#3F4756',
    'Verde intenso': '#3F6A4F',
    'Claro (reflectivo)': '#C8D2E0',
    'Verde (reflectivo)': '#6E9985',
    'Gris (reflectivo)': '#7E8898',
    'Plata / Bronce / Gris / Verde': '#A9B0BB',
    'Negro brillante': '#0B0F1E',
    'Plata': '#BFC6D2',
    'Cromo / Espejo': '#C9D2E0',
    'Satinado': '#E1E7F0',
    'Satinado (ambas caras)': '#DCE3EE',
    'Metálico dorado': '#C9A75A',
    'Neutro (transparente)': '#E4EAF2',
    'Neutro (tono azul suave)': '#C6D2EA',
    'Neutro extra-claro': '#EEF3FA',
    'Neutro (tonalidad gris-azul)': '#8E9BBC',
  };
  const colorOf = p => COLOR_CHIPS[p.color] || '#A9B0BB';

  // ----- Inicialización -----
  function init() {
    renderNeedCards();
    renderFamilyOverview();
    renderGlossary();
    initFiltersUI();
    renderBrowser();
    setupCompareTray();
    setupDrawer();
    setupTweaks();
    setupDecisions();
    setupExport();
    setupSmoothScroll();
    setupMetricPopover();
    setupModalBackdropClicks();
    setupMobileNav();
    setupFiltersToggle();
  }

  // ----- Need cards -----
  function renderNeedCards() {
    const root = $('#need-cards');
    if (!root) return;
    root.innerHTML = NEEDS.map(n => `
      <button class="need-card" data-needs='${JSON.stringify(n.families)}' data-need="${n.n}">
        <div class="nr">${n.n} · NECESIDAD</div>
        <h3>${n.title}</h3>
        <div class="body">${n.body}</div>
        <div class="reco">
          <span class="label">Recomendamos</span>
          ${n.families.map(f => `<span class="pill-link">${f}</span>`).join('<span style="color:var(--ink-3)">·</span>')}
        </div>
      </button>
    `).join('');
    $$('.need-card').forEach(card => {
      card.addEventListener('click', () => {
        const needs = JSON.parse(card.dataset.needs);
        track('necesidad_seleccionada', { necesidad: card.querySelector('h3')?.textContent?.trim() });
        // Apply as familia filter
        state.familias.clear();
        needs.forEach(f => state.familias.add(f));
        syncFilterCheckboxes();
        renderBrowser();
        const tgt = document.getElementById('catalogo');
        if (tgt) tgt.scrollIntoView({ block: 'start' });
      });
    });
  }

  // ----- Family overview -----
  function renderFamilyOverview() {
    const root = $('#fam-grid');
    if (!root) return;
    root.innerHTML = FAMILIAS.map(f => {
      const count = productos.filter(p => p.familia === f.name).length;
      return `
        <div class="fam-cell">
          <h3 class="name">${f.name}</h3>
          <p class="blurb">${f.blurb}</p>
          <div class="when">Cuándo elegirla<strong>${f.when}</strong>
            <div style="margin-top:8px; font-family: var(--mono); font-size:10.5px; color:var(--ink-3); letter-spacing:0.16em;">
              ${count} REFERENCIA${count !== 1 ? 'S' : ''} EN EL CATÁLOGO
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // ----- Glosario -----
  function renderGlossary() {
    const root = $('#glossary');
    if (!root) return;
    root.innerHTML = GLOSARIO.map(g => `
      <div class="gloss-item" id="gloss-${g.key}">
        <div class="term">${g.t}</div>
        <div class="def">${g.d}</div>
        <div class="example">${g.ex}</div>
      </div>
    `).join('');
  }

  // ----- Filtros -----
  function uniq(arr) { return [...new Set(arr)]; }

  // Scroll suave al inicio del área Catálogo + Métricas tras un cambio de filtro,
  // para que el usuario no pierda el hilo si reflowea la lista debajo de él.
  function scrollToCatalogAnchor() {
    const anchor = document.getElementById('metric-legend') || document.getElementById('catalogo');
    if (!anchor) return;
    const topbar = document.querySelector('.topbar');
    const topbarH = topbar ? topbar.getBoundingClientRect().height : 60;
    const targetY = window.scrollY + anchor.getBoundingClientRect().top - topbarH - 12;
    // Solo si el usuario ya pasó el anchor (no interrumpe a quien está arriba)
    if (window.scrollY > targetY - 40) {
      window.scrollTo({ top: Math.max(targetY, 0), behavior: 'smooth' });
    }
  }

  function initFiltersUI() {
    const familias = uniq(productos.map(p => p.familia));
    const colores  = uniq(productos.map(p => p.color)).filter(Boolean);
    const segmentos = uniq(productos.flatMap(p => (p.segmento || '').split('/').map(s => s.trim()))).filter(Boolean);

    renderFilterList('filter-familia', familias, 'familias');
    renderFilterList('filter-color',   colores,  'colores');
    renderFilterList('filter-segmento', segmentos, 'segmento');
    renderFilterList('filter-cap',
      [
        { value: 'templable', label: 'Templable' },
        { value: 'laminable', label: 'Laminable' },
        { value: 'dgu',       label: 'Disponible en DGU' },
      ], 'cap');

    let searchTimer;
    $('#search')?.addEventListener('input', e => {
      state.search = e.target.value.trim();
      renderBrowser();
      clearTimeout(searchTimer);
      if (state.search.length >= 3) {
        searchTimer = setTimeout(() => track('busqueda_realizada', { termino: state.search }), 800);
      }
    });
    $('#sort')?.addEventListener('change', e => {
      state.sortBy = e.target.value;
      renderBrowser();
      scrollToCatalogAnchor();
    });
    $('#reset-filters')?.addEventListener('click', () => {
      state.search = ''; $('#search').value = '';
      state.familias.clear(); state.colores.clear(); state.segmento.clear(); state.cap.clear();
      syncFilterCheckboxes();
      renderBrowser();
      scrollToCatalogAnchor();
    });
  }

  function renderFilterList(rootId, items, key) {
    const root = $('#' + rootId);
    if (!root) return;
    const data = items.map(it => typeof it === 'string' ? { value: it, label: it } : it);
    root.innerHTML = data.map(it => {
      const count = key === 'cap'
        ? productos.filter(p => p[it.value === 'dgu' ? 'dgu' : it.value] && /^SI/.test(p[it.value === 'dgu' ? 'dgu' : it.value])).length
        : key === 'segmento'
          ? productos.filter(p => (p.segmento || '').toLowerCase().includes(it.value.toLowerCase())).length
          : productos.filter(p => p[key === 'familias' ? 'familia' : 'color'] === it.value).length;
      return `
        <label>
          <input type="checkbox" data-key="${key}" value="${it.value}">
          <span>${it.label}</span>
          <span class="count">${count}</span>
        </label>
      `;
    }).join('');
    root.querySelectorAll('input').forEach(cb => {
      cb.addEventListener('change', e => {
        const k = e.target.dataset.key;
        const v = e.target.value;
        const set = state[k];
        if (e.target.checked) { set.add(v); track('filtro_aplicado', { tipo: k, valor: v }); }
        else set.delete(v);
        renderBrowser();
        scrollToCatalogAnchor();
      });
    });
  }

  function syncFilterCheckboxes() {
    $$('input[type="checkbox"][data-key]').forEach(cb => {
      const set = state[cb.dataset.key];
      cb.checked = set && set.has(cb.value);
    });
  }

  function filtered() {
    const q = norm(state.search);
    return productos.filter(p => {
      if (state.familias.size && !state.familias.has(p.familia)) return false;
      if (state.colores.size && !state.colores.has(p.color)) return false;
      if (state.segmento.size) {
        const seg = (p.segmento || '').toLowerCase();
        let any = false;
        state.segmento.forEach(s => { if (seg.includes(s.toLowerCase())) any = true; });
        if (!any) return false;
      }
      if (state.cap.size) {
        for (const c of state.cap) {
          const key = c === 'dgu' ? 'dgu' : c;
          if (!(p[key] && /^SI/.test(p[key]))) return false;
        }
      }
      if (q) {
        const hay = norm([p.nombre, p.familia, p.desc, p.pitch, p.beneficios, p.aplicaciones, p.color, p.necesidad].join(' '));
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  function sortList(list) {
    const key = state.sortBy;
    const sorted = [...list];
    if (key === 'tl')   sorted.sort((a,b) => (b.tl ?? -1) - (a.tl ?? -1));
    else if (key === 'shgc') sorted.sort((a,b) => (a.shgc ?? 99) - (b.shgc ?? 99));
    else if (key === 'sel')  sorted.sort((a,b) => (b.sel ?? -1) - (a.sel ?? -1));
    else if (key === 'nombre') sorted.sort((a,b) => a.nombre.localeCompare(b.nombre));
    // 'familia' = group by family, preserve original order
    return sorted;
  }

  function renderBrowser() {
    const root = $('#product-list');
    if (!root) return;
    const list = sortList(filtered());
    updateFiltersToggleBadge();

    // Results bar
    $('#result-count').textContent = list.length;
    renderActiveFilters();

    if (!list.length) {
      root.innerHTML = `
        <div style="padding: 64px 32px; text-align: center; background: var(--surface); border: 1px solid var(--line); border-radius: var(--card-radius); color: var(--ink-3);">
          <div style="font-family: var(--mono); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 12px;">Sin resultados</div>
          <p style="font-size: 16px; margin: 0;">Prueba aflojando filtros o cambiando la búsqueda.</p>
        </div>
      `;
      return;
    }

    if (state.sortBy === 'familia') {
      const groups = {};
      list.forEach(p => { (groups[p.familia] ||= []).push(p); });
      const familiaOrder = FAMILIAS.map(f => f.name);
      root.innerHTML = familiaOrder
        .filter(name => groups[name])
        .map(name => renderFamilyGroup(name, groups[name]))
        .join('');
      bindFamilyToggles();
    } else {
      root.innerHTML = `<div class="family-group" open><div class="family-body">${list.map(renderProductRow).join('')}</div></div>`;
    }
    bindProductRowActions();
  }

  function renderFamilyGroup(name, rows) {
    const isOpen = state.expanded.has(name) || state.familias.size > 0 || state.search.length > 0;
    return `
      <div class="family-group" ${isOpen ? 'open' : ''} data-fam="${name}">
        <button class="family-head" type="button">
          <span class="fname">${name}</span>
          <span class="fmeta">${rows.length} ref${rows.length !== 1 ? 's' : ''}</span>
          <svg class="chev" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="5 8 10 13 15 8"/></svg>
        </button>
        <div class="family-body">${rows.map(renderProductRow).join('')}</div>
      </div>
    `;
  }

  function renderProductRow(p) {
    const inCompare = state.compare.some(c => c.nombre === p.nombre);
    const dot = `<span aria-hidden="true" style="display:inline-block; width:10px; height:10px; border-radius:50%; background:${colorOf(p)}; border:1px solid rgba(0,0,0,0.08); flex-shrink:0;"></span>`;
    return `
      <div class="product-row${inCompare ? ' is-compared' : ''}" data-nombre="${p.nombre.replace(/"/g,'&quot;')}">
        <div class="pr-name">
          <div class="nm">${p.nombre}</div>
          <div class="meta">${dot}<span>${p.color || '—'}</span><span>·</span><span>${p.configuracion || '—'}</span></div>
        </div>
        <div class="pr-pitch">${p.pitch || p.desc || ''}</div>
        <div class="pr-metrics">
          <div class="pr-metric"><div class="v">${pct(p.tl)}</div><div class="l" data-metric="tl">TL</div></div>
          <div class="pr-metric"><div class="v">${fmt(p.shgc)}</div><div class="l" data-metric="shgc">SHGC</div></div>
          <div class="pr-metric"><div class="v">${p.u || '—'}</div><div class="l" data-metric="u">U-Value</div></div>
          <div class="pr-metric"><div class="v">${fmt(p.sel)}</div><div class="l" data-metric="sel">Sel.</div></div>
          <div class="pr-metric"><div class="v">${pct(p.ref_ext)}</div><div class="l" data-metric="ref">Ref Ext</div></div>
        </div>
        <div class="pr-actions">
          <button class="icon-btn ${inCompare ? 'is-active' : ''}" data-action="compare" title="Comparar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h12M3 18h6"/></svg>
          </button>
          <button class="icon-btn" data-action="open" title="Ver ficha">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 6 15 12 9 18"/></svg>
          </button>
        </div>
      </div>
    `;
  }

  function bindFamilyToggles() {
    $$('.family-head').forEach(btn => {
      btn.addEventListener('click', () => {
        const group = btn.closest('.family-group');
        const fam = group.dataset.fam;
        if (group.hasAttribute('open')) { group.removeAttribute('open'); state.expanded.delete(fam); }
        else { group.setAttribute('open', ''); state.expanded.add(fam); }
      });
    });
  }

  function bindProductRowActions() {
    $$('.product-row').forEach(row => {
      const name = row.dataset.nombre;
      row.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          const action = btn.dataset.action;
          const p = productos.find(x => x.nombre === name);
          if (!p) return;
          if (action === 'compare') toggleCompare(p);
          if (action === 'open') openDrawer(p);
        });
      });
      // Click on the name to open
      row.querySelector('.pr-name')?.addEventListener('click', () => {
        const p = productos.find(x => x.nombre === name);
        if (p) openDrawer(p);
      });
    });
  }

  function renderActiveFilters() {
    const root = $('#active-filters');
    if (!root) return;
    const chips = [];
    state.familias.forEach(f => chips.push({ k: 'familias', v: f, label: f }));
    state.colores.forEach(c => chips.push({ k: 'colores', v: c, label: c }));
    state.segmento.forEach(s => chips.push({ k: 'segmento', v: s, label: s }));
    state.cap.forEach(c => chips.push({ k: 'cap', v: c, label: c === 'dgu' ? 'DGU' : (c.charAt(0).toUpperCase()+c.slice(1)) }));
    root.innerHTML = chips.map(c => `
      <span class="chip">${c.label}<button data-k="${c.k}" data-v="${c.v}" aria-label="quitar">×</button></span>
    `).join('');
    root.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => {
        state[b.dataset.k].delete(b.dataset.v);
        syncFilterCheckboxes();
        renderBrowser();
        scrollToCatalogAnchor();
      });
    });
  }

  // ----- Comparador -----
  function toggleCompare(p) {
    const i = state.compare.findIndex(c => c.nombre === p.nombre);
    if (i >= 0) state.compare.splice(i, 1);
    else if (state.compare.length < 3) state.compare.push(p);
    renderCompareTray();
    renderBrowser();
  }
  function setupCompareTray() {
    renderCompareTray();
    $('#open-compare')?.addEventListener('click', openCompareModal);
    $('#close-compare')?.addEventListener('click', () => $('#compare-modal').classList.remove('is-open'));
    $('#clear-compare')?.addEventListener('click', () => { state.compare = []; renderCompareTray(); renderBrowser(); });
  }
  function renderCompareTray() {
    const tray = $('#compare-tray');
    if (!tray) return;
    const slotsEl = $('#compare-slots');
    const slots = [0, 1, 2].map(i => {
      const p = state.compare[i];
      return p
        ? `<div class="slot is-filled"><span style="font-family: var(--mono); font-size: 11px; color: rgba(255,255,255,0.55);">0${i+1}</span><span style="color:#fff; font-weight:500;">${p.nombre}</span><button class="x" data-i="${i}" aria-label="quitar">×</button></div>`
        : `<div class="slot"><span style="font-family: var(--mono); font-size: 11px; color: rgba(255,255,255,0.4);">0${i+1}</span><span style="color: rgba(255,255,255,0.5);">Añade un vidrio para comparar</span></div>`;
    });
    slotsEl.innerHTML = slots.join('');
    slotsEl.querySelectorAll('.x').forEach(b => b.addEventListener('click', () => {
      state.compare.splice(+b.dataset.i, 1); renderCompareTray(); renderBrowser();
    }));
    if (state.compare.length > 0) tray.classList.add('is-open');
    else tray.classList.remove('is-open');
    $('#open-compare').disabled = state.compare.length < 2;
    $('#open-compare').style.opacity = state.compare.length < 2 ? '0.4' : '1';
  }

  function openCompareModal() {
    if (state.compare.length < 2) return;
    track('comparador_abierto', { productos: state.compare.map(p => p.name).join(' vs '), cantidad: state.compare.length });
    const modal = $('#compare-modal');
    const body  = $('#compare-body');
    const cols = state.compare.length;
    const cellW = `minmax(180px, 1fr)`;
    const gridCol = `220px ${Array(cols).fill(cellW).join(' ')}`;
    function row(label, values, winnerCmp, metricKey) {
      let winnerIdx = -1;
      if (winnerCmp) {
        let best = null;
        values.forEach((v, i) => {
          if (typeof v !== 'number') return;
          if (best === null || winnerCmp(v, best)) { best = v; winnerIdx = i; }
        });
      }
      const lab = metricKey
        ? `${label} <button class="metric-help" data-metric="${metricKey}" aria-label="Qué es ${label}">?</button>`
        : label;
      return `<div class="row" style="grid-template-columns: ${gridCol}">
        <div>${lab}</div>
        ${values.map((v, i) => `<div class="${i === winnerIdx ? 'cell-win' : ''}">${v === null || v === undefined || v === '' || v === 'N/D' ? '—' : v}</div>`).join('')}
      </div>`;
    }
    body.innerHTML = `
      <div class="compare-table">
        <div class="row head" style="grid-template-columns: ${gridCol}">
          <div>Modelo</div>
          ${state.compare.map(p => `<div>${p.nombre}<div style="font-family:var(--mono); font-size:11px; letter-spacing:0.16em; color:var(--accent); margin-top:4px; text-transform:uppercase;">${p.familia}</div></div>`).join('')}
        </div>
        ${row('Configuración', state.compare.map(p => p.configuracion))}
        ${row('Color',         state.compare.map(p => p.color))}
        ${row('Espesor (mm)',  state.compare.map(p => p.espesor_mm))}
        ${row('Transmisión luminosa', state.compare.map(p => p.tl !== null ? p.tl + '%' : null), (a,b)=>a>b, 'tl')}
        ${row('SHGC (g)',      state.compare.map(p => p.shgc), (a,b)=>a<b, 'shgc')}
        ${row('U-Value (W/m²K)', state.compare.map(p => p.u), null, 'u')}
        ${row('Selectividad',  state.compare.map(p => p.sel), (a,b)=>a>b, 'sel')}
        ${row('Reflexión exterior', state.compare.map(p => p.ref_ext !== null ? p.ref_ext + '%' : null), null, 'ref')}
        ${row('Templable',     state.compare.map(p => p.templable), null, 'templado')}
        ${row('Laminable',     state.compare.map(p => p.laminable), null, 'laminado')}
        ${row('Norma',         state.compare.map(p => p.norma))}
        ${row('Aplicación',    state.compare.map(p => p.aplicacion_principal))}
        ${row('Pitch comercial', state.compare.map(p => p.pitch))}
      </div>
      <p style="margin-top: 16px; font-family: var(--mono); font-size: 11px; letter-spacing: 0.16em; color: var(--ink-3); text-transform: uppercase;">
        Celda destacada = mejor valor para ese criterio (TL alto, SHGC bajo, Selectividad alta).
      </p>
    `;
    modal.classList.add('is-open');
  }

  // ----- Drawer (ficha completa) -----
  function setupDrawer() {
    $('#drawer-back')?.addEventListener('click', closeDrawer);
    $('#drawer-close')?.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { closeDrawer(); $('#compare-modal')?.classList.remove('is-open'); $('#decisions-modal')?.classList.remove('is-open'); }
    });
  }
  function openDrawer(p) {
    track('producto_visto', { producto: p.name, familia: p.familia });
    const d = $('#drawer'); const b = $('#drawer-back'); const body = $('#drawer-body');
    body.innerHTML = `
      <div class="drawer-pitch">${p.pitch || p.desc}</div>

      <div class="drawer-section">
        <h4>Beneficios clave</h4>
        <ul class="benef-list">
          ${(p.beneficios || '').split(';').map(s => s.trim()).filter(Boolean).map(s => `<li>${s}</li>`).join('')}
        </ul>
      </div>

      <div class="drawer-section">
        <h4>Especificaciones técnicas</h4>
        <table class="spec-table">
          <tr><td>Configuración</td><td>${p.configuracion || '—'}</td></tr>
          <tr><td>Color</td><td>${p.color || '—'}</td></tr>
          <tr><td>Espesor</td><td>${p.espesor_mm ? p.espesor_mm + ' mm' : '—'}</td></tr>
          <tr><td>Dimensión máx.</td><td>${p.dimensiones_max_mm || '—'} ${p.dimensiones_max_mm && p.dimensiones_max_mm !== 'N/D' ? 'mm' : ''}</td></tr>
          <tr><td>Transmisión luminosa</td><td>${pct(p.tl)}</td></tr>
          <tr><td>SHGC (g)</td><td>${fmt(p.shgc)}</td></tr>
          <tr><td>Coef. sombra</td><td>${fmt(p.sc)}</td></tr>
          <tr><td>Selectividad</td><td>${fmt(p.sel)}</td></tr>
          <tr><td>U-Value</td><td>${p.u || '—'}</td></tr>
          <tr><td>Reflexión ext./int.</td><td>${pct(p.ref_ext)} / ${pct(p.ref_int)}</td></tr>
          <tr><td>Norma</td><td>${p.norma || '—'}</td></tr>
          <tr><td>Templable</td><td>${p.templable || '—'}</td></tr>
          <tr><td>Laminable</td><td>${p.laminable || '—'}</td></tr>
          <tr><td>Disponible en DGU</td><td>${p.dgu || '—'}</td></tr>
        </table>
      </div>

      <div class="drawer-section">
        <h4>Aplicaciones</h4>
        <p style="font-size:14px; color:var(--ink-2); margin:0; line-height:1.55;">${p.aplicaciones || '—'}</p>
      </div>

      <div class="drawer-section">
        <h4>Necesidad del cliente</h4>
        <p style="font-size:14px; color:var(--ink-2); margin:0; line-height:1.55;">${p.necesidad || '—'}</p>
      </div>

      ${p.notas ? `
      <div class="drawer-section">
        <h4>Notas técnicas</h4>
        <p style="font-size:13px; color:var(--ink-3); margin:0; line-height:1.55; font-family:var(--mono);">${p.notas}</p>
      </div>` : ''}

      <div class="drawer-section" style="border-top: 1px solid var(--line); padding-top: 24px; margin-top: 24px;">
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <button class="btn btn-primary" onclick="window.scrollTo(0,0); document.querySelector('#cotizar')?.scrollIntoView()">Cotizar este sistema</button>
          <a class="btn btn-outline" href="${p.url}" target="_blank" rel="noopener">Ficha Saint-Gobain ↗</a>
        </div>
      </div>
    `;
    $('#drawer-fam').textContent = p.familia;
    $('#drawer-title').textContent = p.nombre;
    d.classList.add('is-open');
    b.classList.add('is-open');
  }
  function closeDrawer() {
    $('#drawer')?.classList.remove('is-open');
    $('#drawer-back')?.classList.remove('is-open');
  }

  // ----- Tweaks panel -----
  function setupTweaks() {
    const panel = $('#tweaks');
    const toggle = $('#tweaks-toggle');
    toggle?.addEventListener('click', () => {
      panel.classList.add('is-open');
      toggle.classList.remove('is-shown');
    });
    $('#tweaks-close')?.addEventListener('click', () => {
      panel.classList.remove('is-open');
      toggle.classList.add('is-shown');
    });
    // Segmented controls
    $$('.seg').forEach(seg => {
      seg.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
          seg.querySelectorAll('button').forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');
          const attr = seg.dataset.attr;
          document.documentElement.setAttribute(attr, btn.dataset.value);
          try { localStorage.setItem('kz-' + attr, btn.dataset.value); } catch(e) {}
        });
      });
    });
    // Restore from localStorage
    try {
      ['data-direction','data-density','data-accent'].forEach(attr => {
        const v = localStorage.getItem('kz-' + attr);
        if (v) {
          document.documentElement.setAttribute(attr, v);
          const btn = document.querySelector(`.seg[data-attr="${attr}"] button[data-value="${v}"]`);
          if (btn) {
            btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
          }
        }
      });
    } catch(e) {}
    // Show toggle button initially
    toggle?.classList.add('is-shown');
  }

  // ----- Decisiones modal -----
  function setupDecisions() {
    $('#open-decisions')?.addEventListener('click', () => $('#decisions-modal').classList.add('is-open'));
    $('#close-decisions')?.addEventListener('click', () => $('#decisions-modal').classList.remove('is-open'));
  }

  // ----- Export (build PDF) -----
  function setupExport() {
    $$('[data-action="export"]').forEach(b => b.addEventListener('click', async () => {
      if (typeof window.generatePDF !== 'function') {
        console.error('generatePDF no disponible — verifica pdf-export.js');
        alert('No se pudo cargar el generador de PDF.');
        return;
      }
      const orig = b.innerHTML;
      b.disabled = true;
      b.style.opacity = '0.6';
      b.style.pointerEvents = 'none';
      b.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px;">Generando…</span>';
      try {
        // Expand all family groups so getCtx() sees the full state (state.expanded only affects UI)
        await window.generatePDF();
      } catch (err) {
        console.error('PDF export error:', err);
        alert('Error al generar el PDF: ' + (err.message || err));
      } finally {
        b.disabled = false;
        b.style.opacity = '';
        b.style.pointerEvents = '';
        b.innerHTML = orig;
      }
    }));
  }

  // ----- Smooth scroll for in-page anchors -----
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href').slice(1);
        if (!id) return;
        if (id === 'cotizar') track('cotizar_click', { origen: a.closest('section')?.id || 'nav' });
        const el = document.getElementById(id);
        if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      });
    });
    // CTA links directos (mailto, tel, whatsapp) en la sección cotizar
    document.querySelectorAll('#cotizar a[href^="mailto"], #cotizar a[href^="tel"], #cotizar a[href*="wa.me"]').forEach(a => {
      a.addEventListener('click', () => track('cotizar_click', { origen: 'cta_final', canal: a.href.split(':')[0] }));
    });
  }

  // ----- Metric explainer popover (delegated, anchored) -----
  function setupMetricPopover() {
    const pop = $('#metric-pop');
    if (!pop) return;
    let currentTrigger = null;

    function open(trigger) {
      const key = trigger.dataset.metric;
      const g = GLOSS_BY_KEY[key];
      if (!g) return;
      currentTrigger = trigger;
      $('#mp-term').textContent = g.short || '';
      $('#mp-title').textContent = g.t;
      $('#mp-body').textContent = g.d;
      $('#mp-example').innerHTML = g.ex;
      $('#mp-scale').textContent = g.scale || '';
      $('#mp-link').setAttribute('href', '#gloss-' + g.key);
      pop.hidden = false;
      positionPopover(trigger);
      pop.classList.add('is-open');
      // Mark trigger active
      $$('.metric-help.is-open, .metric-chip.is-open').forEach(el => el.classList.remove('is-open'));
      trigger.classList.add('is-open');
    }
    function positionPopover(trigger) {
      const r = trigger.getBoundingClientRect();
      const popW = pop.offsetWidth || 360;
      const popH = pop.offsetHeight || 300;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let left = r.left + r.width / 2 - popW / 2;
      let top  = r.bottom + 8;
      if (left + popW > vw - 12) left = vw - popW - 12;
      if (left < 12) left = 12;
      if (top + popH > vh - 12) top = r.top - popH - 8;
      if (top < 12) top = 12;
      pop.style.left = (left + window.scrollX) + 'px';
      pop.style.top  = (top  + window.scrollY) + 'px';
    }
    function close() {
      pop.classList.remove('is-open');
      pop.hidden = true;
      if (currentTrigger) currentTrigger.classList.remove('is-open');
      currentTrigger = null;
    }

    // Delegated: any element with [data-metric] opens the popover
    document.addEventListener('click', e => {
      const trig = e.target.closest('[data-metric]');
      if (trig) {
        e.preventDefault();
        e.stopPropagation();
        if (currentTrigger === trig) { close(); return; }
        open(trig);
        return;
      }
      // click outside popover & not on a trigger → close
      if (!pop.hidden && !pop.contains(e.target)) close();
    });

    $('#mp-close')?.addEventListener('click', close);
    $('#mp-link')?.addEventListener('click', e => {
      // Close popover but allow anchor to scroll & pulse glossary entry
      const href = $('#mp-link').getAttribute('href');
      if (href && href.startsWith('#gloss-')) {
        const id = href.slice(1);
        const el = document.getElementById(id);
        if (el) {
          e.preventDefault();
          close();
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('is-pulsing');
          setTimeout(() => el.classList.remove('is-pulsing'), 1800);
        }
      } else {
        close();
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !pop.hidden) close();
    });
    // Reposition on scroll/resize while open
    ['scroll', 'resize'].forEach(ev => {
      window.addEventListener(ev, () => {
        if (!pop.hidden && currentTrigger) positionPopover(currentTrigger);
      }, { passive: true });
    });
  }

  // ----- Modal backdrop click-to-close -----
  function setupModalBackdropClicks() {
    [['compare-modal', 'close-compare'], ['decisions-modal', 'close-decisions']].forEach(([modalId, closeBtnId]) => {
      const modal = document.getElementById(modalId);
      if (!modal) return;
      modal.addEventListener('click', e => {
        // Close only when clicking the modal background itself (not the inner card)
        if (e.target === modal) {
          modal.classList.remove('is-open');
        }
      });
    });
  }

  // ----- Mobile navigation -----
  function setupMobileNav() {
    const btn = $('#mobile-nav-btn');
    const nav = $('#mobile-nav');
    const bg  = $('#mobile-nav-bg');
    const closeBtn = $('#mobile-nav-close');
    if (!btn || !nav) return;

    function openNav() {
      nav.classList.add('is-open');
      nav.removeAttribute('aria-hidden');
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function closeNav() {
      nav.classList.remove('is-open');
      nav.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', openNav);
    bg?.addEventListener('click', closeNav);
    closeBtn?.addEventListener('click', closeNav);
    $$('.mobile-nav-link, .mobile-nav-footer .btn').forEach(a => a.addEventListener('click', closeNav));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('is-open')) closeNav(); });
  }

  // ----- Filters toggle (mobile) -----
  function setupFiltersToggle() {
    const btn   = $('#filters-toggle');
    const panel = $('#filters-panel');
    if (!btn || !panel) return;

    btn.addEventListener('click', () => {
      const isOpen = panel.classList.toggle('is-open');
      btn.classList.toggle('is-open', isOpen);
      btn.setAttribute('aria-expanded', String(isOpen));
    });
  }

  function updateFiltersToggleBadge() {
    const badge = $('#filters-count');
    if (!badge) return;
    const count = state.familias.size + state.colores.size + state.segmento.size + state.cap.size;
    badge.textContent = count;
    if (count > 0) badge.classList.add('has-filters');
    else badge.classList.remove('has-filters');
  }

  // Boot
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);

  // ----- Expose API for PDF export -----
  window.CATALOGO_API = {
    getState:  () => state,
    filtered:  filtered,
    NEEDS:     NEEDS,
    FAMILIAS:  FAMILIAS,
    GLOSARIO:  GLOSARIO,
    GLOSS_BY_KEY: GLOSS_BY_KEY,
    productos: productos,
  };
})();
