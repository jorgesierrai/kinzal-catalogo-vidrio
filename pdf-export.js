/* =========================================================================
   Catálogo HP Templados × Saint-Gobain · PDF Export
   Usa jsPDF + jspdf-autotable. Build dinámico según filtros activos.
   ========================================================================= */
(function() {
  'use strict';

  // ----- Paleta y página -----
  const C = {
    marine:     [26, 42, 108],
    marineDeep: [19, 31, 82],
    blue:       [46, 91, 224],
    violet:     [155, 63, 212],
    light:      [240, 244, 248],
    light2:     [228, 234, 242],
    line:       [216, 222, 233],
    ink:        [26, 42, 108],
    ink2:       [45, 58, 90],
    ink3:       [110, 124, 152],
    white:      [255, 255, 255],
    black:      [10, 14, 30],
  };
  const PAGE = { w: 210, h: 297, mx: 16, mt: 18, mb: 20 };
  const CW = PAGE.w - PAGE.mx * 2;

  // ----- Util -----
  function slugify(s, max) {
    max = max || 40;
    return (s || '')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, max);
  }
  function setFill(doc, c)   { doc.setFillColor(c[0], c[1], c[2]); }
  function setText(doc, c)   { doc.setTextColor(c[0], c[1], c[2]); }
  function setDraw(doc, c)   { doc.setDrawColor(c[0], c[1], c[2]); }
  // Helvetica WinAnsi no soporta ≤ ≥ → ← — algunos chars: los normalizamos.
  function pdfSafe(s) {
    if (s === null || s === undefined) return '';
    if (typeof s !== 'string') s = String(s);
    return s
      .replace(/≤/g, '<=')
      .replace(/≥/g, '>=')
      .replace(/→/g, '>')
      .replace(/←/g, '<')
      .replace(/[\u00A0]/g, ' ')   // nbsp → space
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'");
  }
  function ptext(doc, s, x, y, opts) {
    return doc.text(pdfSafe(s), x, y, opts);
  }
  function fmt(v, suffix, dash) {
    dash = dash || '—';
    if (v === null || v === undefined || v === '' || v === 'N/D') return dash;
    if (typeof v === 'number') return v + (suffix || '');
    return v;
  }
  function pct(v) { return fmt(v, '%'); }
  function plainTitle(t) { return (t || '').replace(/[.!?]$/, ''); }

  // ----- Isotipo Kinzal (recreado en vectores PDF) -----
  // El SVG fuente: viewBox 86×90; trazo en líneas rectas.
  function drawIsotipo(doc, x, y, size, colorRGB) {
    // mapping de viewBox (0..86, 0..90) a destino (x..x+size, y..y+size*90/86)
    const sx = size / 86;
    const sy = (size * 90 / 86) / 90;
    const X = (vx) => x + vx * sx;
    const Y = (vy) => y + (vy - 7) * sy; // translate(0,-7)
    setDraw(doc, colorRGB);
    doc.setLineWidth(0.55);
    // rect outer
    doc.rect(X(8), Y(14), (78-8)*sx, (90-14)*sy);
    // vertical dividers
    doc.line(X(32), Y(14), X(32), Y(90));
    doc.line(X(54), Y(14), X(54), Y(90));
    // horizontals
    doc.line(X(8),  Y(33), X(78), Y(33));
    doc.line(X(8),  Y(52), X(78), Y(52));
    doc.line(X(8),  Y(71), X(78), Y(71));
    // descenders (legs)
    doc.line(X(20), Y(76), X(20), Y(90));
    doc.line(X(42), Y(80), X(42), Y(90));
  }

  // ----- Contexto + filename dinámico -----
  function getCtx() {
    const api = window.CATALOGO_API;
    if (!api) throw new Error('CATALOGO_API no cargado');
    const state = api.getState();
    const filteredProducts = api.filtered();
    const NEEDS = api.NEEDS;
    const FAMILIAS = api.FAMILIAS;
    const GLOSARIO = api.GLOSARIO;

    const filterCount =
      state.familias.size + state.colores.size +
      state.segmento.size + state.cap.size +
      (state.search ? 1 : 0);
    const hasFilters = filterCount > 0;

    // ¿Match exacto con un NEED?
    let matchedNeed = null;
    if (
      state.familias.size > 0 &&
      state.colores.size === 0 && state.segmento.size === 0 &&
      state.cap.size === 0 && !state.search
    ) {
      matchedNeed = NEEDS.find(n =>
        n.families.length === state.familias.size &&
        n.families.every(f => state.familias.has(f))
      );
    }

    let subtitle, filename;
    if (!hasFilters) {
      subtitle = 'Catálogo completo 2026';
      filename = 'Kinzal-Catalogo-Completo-SaintGobain-2026.pdf';
    } else if (matchedNeed) {
      subtitle = 'Selección para: ' + plainTitle(matchedNeed.title);
      filename = 'Kinzal-Seleccion-' + slugify(matchedNeed.title.split('.')[0]) + '-2026.pdf';
    } else if (
      state.familias.size === 1 && !state.colores.size &&
      !state.segmento.size && !state.cap.size && !state.search
    ) {
      const fam = [...state.familias][0];
      subtitle = 'Selección: ' + fam;
      filename = 'Kinzal-Seleccion-' + slugify(fam) + '-2026.pdf';
    } else {
      subtitle = 'Selección personalizada';
      filename = 'Kinzal-Seleccion-Personalizada-2026.pdf';
    }

    // Necesidades relevantes
    let relevantNeeds;
    if (matchedNeed) {
      relevantNeeds = [matchedNeed];
    } else if (hasFilters) {
      const famsInResult = new Set(filteredProducts.map(p => p.familia));
      relevantNeeds = NEEDS.filter(n => n.families.some(f => famsInResult.has(f)));
      if (!relevantNeeds.length) relevantNeeds = NEEDS;
    } else {
      relevantNeeds = NEEDS;
    }

    // Familias involucradas (orden de FAMILIAS)
    const famsInResult = new Set(filteredProducts.map(p => p.familia));
    const involvedFamilias = FAMILIAS.filter(f => famsInResult.has(f.name));

    return {
      state, hasFilters, matchedNeed, filterCount,
      filteredProducts, NEEDS, FAMILIAS, GLOSARIO,
      subtitle, filename, relevantNeeds, involvedFamilias,
      catalogUrl: window.location.href.split('#')[0]
    };
  }

  // ----- Pie de página común -----
  function drawPageFooter(doc, ctx, pageNum, totalPages) {
    const y = PAGE.h - 10;
    setText(doc, C.ink3);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    // izq: marca
    doc.text('Kinzal · Catálogo HP Templados × Saint-Gobain', PAGE.mx, y);
    // centro: paginación
    doc.text(pageNum + ' / ' + totalPages, PAGE.w / 2, y, { align: 'center' });
    // der: nota de selección filtrada
    if (ctx.hasFilters) {
      doc.setFont('helvetica', 'bold');
      setText(doc, C.violet);
      doc.text('Selección filtrada  >  ver catálogo completo', PAGE.w - PAGE.mx, y, { align: 'right' });
    } else {
      doc.text('kinzal.ai', PAGE.w - PAGE.mx, y, { align: 'right' });
    }
    // hot zone link sobre el footer derecho
    doc.link(PAGE.w - PAGE.mx - 70, y - 4, 70, 6, { url: ctx.catalogUrl });
  }

  // ----- Página 1: Portada -----
  function drawCover(doc, ctx) {
    // Fondo marine full-bleed
    setFill(doc, C.marine);
    doc.rect(0, 0, PAGE.w, PAGE.h, 'F');

    // Patrón de grid sutil
    setDraw(doc, [38, 54, 122]);
    doc.setLineWidth(0.1);
    for (let i = 0; i <= PAGE.w; i += 12) {
      doc.line(i, 0, i, PAGE.h);
    }
    for (let i = 0; i <= PAGE.h; i += 12) {
      doc.line(0, i, PAGE.w, i);
    }

    // Isotipo + lockup
    drawIsotipo(doc, PAGE.mx, 20, 20, C.white);
    setText(doc, C.white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('KINZAL', PAGE.mx + 26, 30);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    setText(doc, [180, 195, 230]);
    doc.text('CATÁLOGO · HP TEMPLADOS', PAGE.mx + 26, 36);

    // Banderola eyebrow
    setText(doc, [180, 195, 230]);
    doc.setFontSize(9);
    doc.text('VENTA E INSTALACIÓN SAINT-GOBAIN GLASS MÉXICO', PAGE.mx, 90);

    // Título principal
    setText(doc, C.white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(30);
    doc.text('Catálogo', PAGE.mx, 110);
    doc.text('HP Templados', PAGE.mx, 124);
    setText(doc, [200, 170, 240]);
    doc.setFontSize(26);
    doc.text('x Saint-Gobain', PAGE.mx, 138);

    // Subtítulo (selección)
    setText(doc, C.white);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    const subLines = doc.splitTextToSize(ctx.subtitle, CW - 20);
    doc.text(subLines, PAGE.mx, 156);

    // Badge filtros activos
    let cursorY = 156 + (subLines.length * 6) + 8;
    if (ctx.hasFilters) {
      const badgeText = 'Este PDF es una selección filtrada. El catálogo completo (61 vidrios) está disponible en línea.';
      const badgeLines = doc.splitTextToSize(badgeText, CW - 20);
      const badgeH = 12 + badgeLines.length * 4.5;
      setFill(doc, [40, 60, 140]);
      doc.roundedRect(PAGE.mx, cursorY, CW, badgeH, 2, 2, 'F');
      setDraw(doc, C.violet);
      doc.setLineWidth(0.4);
      doc.line(PAGE.mx, cursorY, PAGE.mx, cursorY + badgeH); // accent left
      setText(doc, C.violet);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('SELECCIÓN FILTRADA', PAGE.mx + 5, cursorY + 6);
      setText(doc, C.white);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(badgeLines, PAGE.mx + 5, cursorY + 12);
      cursorY += badgeH + 6;
    }

    // Cifras hero
    cursorY = Math.max(cursorY, 200);
    setDraw(doc, [80, 95, 160]);
    doc.setLineWidth(0.3);
    doc.line(PAGE.mx, cursorY, PAGE.w - PAGE.mx, cursorY);
    cursorY += 8;
    const stats = [
      { n: String(ctx.filteredProducts.length), l: 'VIDRIOS EN ESTE PDF' },
      { n: String(new Set(ctx.filteredProducts.map(p => p.familia)).size), l: 'FAMILIAS' },
      { n: '1', l: 'PROVEEDOR ÚNICO' },
      { n: '100%', l: 'GARANTÍA' },
    ];
    const colW = CW / 4;
    stats.forEach((s, i) => {
      const cx = PAGE.mx + i * colW;
      setText(doc, C.white);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(26);
      doc.text(s.n, cx, cursorY + 10);
      setText(doc, [180, 195, 230]);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text(s.l, cx, cursorY + 16);
    });

    // Pie portada
    const footY = PAGE.h - 22;
    setText(doc, [180, 195, 230]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const today = new Date();
    const dateStr = today.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
    doc.text('Generado · ' + dateStr, PAGE.mx, footY);
    setText(doc, C.white);
    doc.setFont('helvetica', 'bold');
    doc.text('Ver catálogo interactivo  >', PAGE.w - PAGE.mx, footY, { align: 'right' });
    doc.link(PAGE.w - PAGE.mx - 65, footY - 4, 65, 6, { url: ctx.catalogUrl });

    setText(doc, [120, 140, 180]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('© 2026 KINZAL · GUADALAJARA · HP TEMPLADOS · DISTRIBUIDOR AUTORIZADO SGG MX', PAGE.mx, PAGE.h - 12);
  }

  // ----- Encabezado de página interior -----
  function drawSectionHeader(doc, label, title, y) {
    setText(doc, C.ink3);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(label.toUpperCase(), PAGE.mx, y);
    setText(doc, C.ink);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    const lines = doc.splitTextToSize(title, CW);
    doc.text(lines, PAGE.mx, y + 8);
    setDraw(doc, C.violet);
    doc.setLineWidth(0.5);
    doc.line(PAGE.mx, y + 12 + lines.length * 6, PAGE.mx + 20, y + 12 + lines.length * 6);
    return y + 16 + lines.length * 6;
  }

  // ----- Sección: Quiénes somos -----
  function drawQuienesSomos(doc, ctx, startY) {
    let y = drawSectionHeader(doc, '01 · Sistema completo', 'Más que vidrio: el sistema completo', startY);
    setText(doc, C.ink2);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const intro = 'HP Templados es fábrica y distribuidor autorizado Saint-Gobain Glass México. Kinzal integra el aluminio, la perfilería y la instalación. Lo entregamos como un solo sistema: del perfil extruido a la fachada terminada, bajo un mismo contrato y una garantía única.';
    const introLines = doc.splitTextToSize(intro, CW);
    doc.text(introLines, PAGE.mx, y);
    y += introLines.length * 4.8 + 6;

    // Cifras 1 · 0 · 100%
    const cifras = [
      { n: '1', l: 'CONTRATO ÚNICO', d: 'Sin coordinar tres proveedores ni culpas cruzadas.' },
      { n: '0', l: 'INTERMEDIARIOS', d: 'Del perfil extruido a la fachada terminada.' },
      { n: '100%', l: 'GARANTÍA ÚNICA', d: 'Vidrio + perfilería + instalación, un solo responsable.' },
    ];
    const colW = CW / 3;
    cifras.forEach((c, i) => {
      const cx = PAGE.mx + i * colW;
      setText(doc, C.ink);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.text(c.n, cx, y + 9);
      setText(doc, C.violet);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.text(c.l, cx, y + 14);
      setText(doc, C.ink3);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      const dLines = doc.splitTextToSize(c.d, colW - 4);
      doc.text(dLines, cx, y + 19);
    });
    y += 32;

    // 4-step process
    const steps = [
      { n: '01', t: 'Suministro',   sub: 'Vidrio Saint-Gobain',       who: 'HP Templados' },
      { n: '02', t: 'Aluminio',     sub: 'Perfilería arquitectónica', who: 'Kinzal' },
      { n: '03', t: 'Temple',       sub: 'Templado y laminado',       who: 'HP Templados' },
      { n: '04', t: 'Instalación',  sub: 'Obra y montaje',            who: 'Kinzal' },
    ];
    const stepW = CW / 4;
    const stepH = 30;
    // Background marine
    setFill(doc, C.marine);
    doc.rect(PAGE.mx, y, CW, stepH, 'F');
    steps.forEach((s, i) => {
      const sx = PAGE.mx + i * stepW;
      // Separador
      if (i > 0) {
        setDraw(doc, [70, 85, 150]);
        doc.setLineWidth(0.2);
        doc.line(sx, y + 4, sx, y + stepH - 4);
      }
      setText(doc, [170, 185, 220]);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text(s.n + ' · ' + s.t.toUpperCase(), sx + 4, y + 8);
      setText(doc, C.white);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      const subLines = doc.splitTextToSize(s.sub, stepW - 8);
      doc.text(subLines, sx + 4, y + 14);
      setText(doc, [200, 170, 240]);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text(s.who.toUpperCase(), sx + 4, y + stepH - 4);
    });
    return y + stepH + 8;
  }

  // ----- Sección: Necesidades -----
  function drawNecesidades(doc, ctx, startY) {
    let y = startY;
    const label = ctx.relevantNeeds.length === ctx.NEEDS.length ? '02 · Necesidades' :
                  ctx.relevantNeeds.length === 1 ? '02 · Necesidad' : '02 · Necesidades relevantes';
    const title = ctx.relevantNeeds.length === 1 ? '¿Qué resolvemos aquí?' :
                  ctx.relevantNeeds.length === ctx.NEEDS.length ? 'Las 8 entradas más comunes' :
                  'Necesidades que cubren esta selección';
    y = drawSectionHeader(doc, label, title, y);

    const cols = ctx.relevantNeeds.length <= 2 ? 1 : 2;
    const cardW = (CW - (cols - 1) * 4) / cols;

    // Pre-compute card metrics so we can lay out by ROW with max-height tracking
    const cards = ctx.relevantNeeds.map(n => {
      const lines = doc.splitTextToSize(pdfSafe(n.title), cardW - 8);
      const bodyLines = doc.splitTextToSize(pdfSafe(n.body), cardW - 8);
      const famLines = doc.splitTextToSize(pdfSafe('Recomendamos: ' + n.families.join(' · ')), cardW - 8);
      const h = 12 + lines.length * 5 + bodyLines.length * 4 + famLines.length * 4 + 10;
      return { n, lines, bodyLines, famLines, h };
    });

    // Group into rows
    const rows = [];
    for (let i = 0; i < cards.length; i += cols) {
      rows.push(cards.slice(i, i + cols));
    }

    let rowY = y;
    rows.forEach((row) => {
      const rowH = Math.max.apply(null, row.map(c => c.h));
      // page break si la fila completa no entra
      if (rowY + rowH > PAGE.h - PAGE.mb - 10) {
        doc.addPage();
        rowY = PAGE.mt;
      }
      row.forEach((card, ci) => {
        const cx = PAGE.mx + ci * (cardW + 4);
        // Fill explícito justo antes del rect (sobrevive addPage)
        setFill(doc, C.light);
        doc.roundedRect(cx, rowY, cardW, rowH, 2, 2, 'F');
        const startX = cx + 4;
        setText(doc, C.violet);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.text(card.n.n + ' · NECESIDAD', startX, rowY + 6);
        setText(doc, C.ink);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(card.lines, startX, rowY + 11);
        setText(doc, C.ink2);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.text(card.bodyLines, startX, rowY + 12 + card.lines.length * 5);
        setText(doc, C.blue);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text(card.famLines, startX, rowY + 14 + card.lines.length * 5 + card.bodyLines.length * 4);
      });
      rowY += rowH + 4;
    });
    return rowY + 2;
  }

  // ----- Sección: Métricas -----
  function drawMetricas(doc, ctx, startY) {
    let y = drawSectionHeader(doc, '03 · Métricas', 'Las cinco métricas que decide un arquitecto', startY);

    const G = ctx.GLOSARIO.filter(g => ['tl','shgc','u','sel','ref'].includes(g.key));
    const rows = G.map(g => {
      // Strip rich text and normalize chars
      const exClean = pdfSafe((g.ex || '').replace(/<[^>]+>/g, ''));
      return [
        pdfSafe(g.t.split('·')[0].trim()),
        pdfSafe(g.short || ''),
        pdfSafe(g.d || ''),
        pdfSafe(g.scale || ''),
        exClean
      ];
    });
    doc.autoTable({
      startY: y,
      head: [['Sigla', 'En una línea', 'Qué significa', 'Rango típico', 'Ejemplo']],
      body: rows,
      theme: 'plain',
      styles: {
        font: 'helvetica',
        fontSize: 8.5,
        cellPadding: { top: 3, right: 3, bottom: 3, left: 3 },
        lineColor: C.line,
        lineWidth: 0.15,
        textColor: C.ink2,
      },
      headStyles: {
        fillColor: C.marine,
        textColor: C.white,
        fontStyle: 'bold',
        fontSize: 8,
        cellPadding: { top: 3.5, right: 3, bottom: 3.5, left: 3 },
      },
      alternateRowStyles: { fillColor: C.light },
      columnStyles: {
        0: { cellWidth: 22, fontStyle: 'bold', textColor: C.ink },
        1: { cellWidth: 34, fontStyle: 'bold', textColor: C.ink },
        2: { cellWidth: 60 },
        3: { cellWidth: 24, textColor: C.ink3, fontSize: 8 },
        4: { cellWidth: 'auto' },
      },
      margin: { left: PAGE.mx, right: PAGE.mx },
    });
    return doc.lastAutoTable.finalY + 6;
  }

  // ----- Sección: Productos por familia -----
  function drawProductos(doc, ctx, startY) {
    let y = drawSectionHeader(doc, '04 · Vidrios en esta selección', ctx.filteredProducts.length + ' vidrios en ' + ctx.involvedFamilias.length + ' familias', startY);

    if (!ctx.filteredProducts.length) {
      setText(doc, C.ink3);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(11);
      doc.text('Sin resultados para los filtros actuales.', PAGE.mx, y + 10);
      return y + 20;
    }

    // Agrupar por familia, orden de FAMILIAS
    const groups = {};
    ctx.filteredProducts.forEach(p => {
      (groups[p.familia] = groups[p.familia] || []).push(p);
    });
    const orderedNames = ctx.FAMILIAS.map(f => f.name).filter(n => groups[n]);

    orderedNames.forEach((famName) => {
      const list = groups[famName];

      // Espacio mínimo para encabezado de familia + 1 fila
      if (y > PAGE.h - PAGE.mb - 40) {
        doc.addPage();
        y = PAGE.mt;
      }

      // Header de familia
      setFill(doc, C.marine);
      doc.rect(PAGE.mx, y, CW, 9, 'F');
      setText(doc, C.white);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(famName, PAGE.mx + 4, y + 6);
      setText(doc, [180, 195, 230]);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(list.length + ' ref' + (list.length === 1 ? '' : 's'), PAGE.w - PAGE.mx - 4, y + 6, { align: 'right' });
      y += 9;

      const rows = list.map(p => {
        const pitch = (p.pitch || p.desc || '').replace(/<[^>]+>/g, '');
        return [
          p.nombre || '',
          [p.color || '—', p.configuracion || '—'].join('\n'),
          pct(p.tl),
          fmt(p.shgc),
          p.u || '—',
          fmt(p.sel),
          pct(p.ref_ext),
          pitch
        ];
      });

      doc.autoTable({
        startY: y,
        head: [['Vidrio', 'Color / Config', 'TL', 'SHGC', 'U', 'Sel', 'RefE', 'Para qué']],
        body: rows,
        theme: 'plain',
        styles: {
          font: 'helvetica',
          fontSize: 7.5,
          cellPadding: { top: 2.5, right: 2.5, bottom: 2.5, left: 2.5 },
          lineColor: C.line,
          lineWidth: 0.15,
          textColor: C.ink2,
          valign: 'middle',
        },
        headStyles: {
          fillColor: C.light2,
          textColor: C.ink,
          fontStyle: 'bold',
          fontSize: 7,
          cellPadding: { top: 2.5, right: 2.5, bottom: 2.5, left: 2.5 },
        },
        alternateRowStyles: { fillColor: C.light },
        columnStyles: {
          0: { cellWidth: 38, fontStyle: 'bold', textColor: C.ink },
          1: { cellWidth: 24, fontSize: 7, textColor: C.ink3 },
          2: { cellWidth: 12, halign: 'right' },
          3: { cellWidth: 12, halign: 'right' },
          4: { cellWidth: 12, halign: 'right' },
          5: { cellWidth: 12, halign: 'right' },
          6: { cellWidth: 12, halign: 'right' },
          7: { cellWidth: 'auto' },
        },
        margin: { left: PAGE.mx, right: PAGE.mx },
      });
      y = doc.lastAutoTable.finalY + 5;
    });
    return y;
  }

  // ----- Sección: Familias involucradas -----
  function drawFamilias(doc, ctx, startY) {
    let y = startY;
    if (!ctx.involvedFamilias.length) return y;

    const cols = 2;
    const cardW = (CW - 4) / cols;

    // Pre-compute card heights
    const cards = ctx.involvedFamilias.map(f => {
      const blurbLines = doc.splitTextToSize(pdfSafe(f.blurb), cardW - 8);
      const whenLines = doc.splitTextToSize(pdfSafe('Cuándo: ' + f.when), cardW - 8);
      const h = 10 + blurbLines.length * 4 + 4 + whenLines.length * 4 + 6;
      return { f, blurbLines, whenLines, h };
    });

    // Asegurar que el encabezado + primera fila quepan juntos
    const firstRowH = Math.max(
      cards[0] ? cards[0].h : 30,
      cards[1] ? cards[1].h : 30
    );
    const headerSpace = 24; // alto del section header
    if (y + headerSpace + firstRowH > PAGE.h - PAGE.mb - 10) {
      doc.addPage();
      y = PAGE.mt;
    }
    y = drawSectionHeader(doc, '05 · Familias', 'Cuándo elegir cada familia', y);

    // Group into rows
    const rows = [];
    for (let i = 0; i < cards.length; i += cols) {
      rows.push(cards.slice(i, i + cols));
    }

    let rowY = y;
    rows.forEach((row) => {
      const rowH = Math.max.apply(null, row.map(c => c.h));
      if (rowY + rowH > PAGE.h - PAGE.mb - 10) {
        doc.addPage();
        rowY = PAGE.mt;
      }
      row.forEach((card, ci) => {
        const cx = PAGE.mx + ci * (cardW + 4);
        setFill(doc, C.light);
        doc.roundedRect(cx, rowY, cardW, rowH, 2, 2, 'F');
        setText(doc, C.ink);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(pdfSafe(card.f.name), cx + 4, rowY + 6);
        setText(doc, C.ink2);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text(card.blurbLines, cx + 4, rowY + 10);
        setText(doc, C.blue);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.text(card.whenLines, cx + 4, rowY + 10 + card.blurbLines.length * 4 + 4);
      });
      rowY += rowH + 4;
    });
    return rowY + 4;
  }

  // ----- Última sección: Cotización -----
  function drawCotizacion(doc, ctx) {
    // Garantizar página propia si queda poco
    doc.addPage();
    // Fondo Marine full-bleed
    setFill(doc, C.marine);
    doc.rect(0, 0, PAGE.w, PAGE.h, 'F');

    // Grid bg
    setDraw(doc, [38, 54, 122]);
    doc.setLineWidth(0.1);
    for (let i = 0; i <= PAGE.w; i += 12) doc.line(i, 0, i, PAGE.h);
    for (let i = 0; i <= PAGE.h; i += 12) doc.line(0, i, PAGE.w, i);

    // Eyebrow
    setText(doc, C.violet);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('SIGUIENTE PASO', PAGE.mx, 40);

    // Título
    setText(doc, C.white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(32);
    doc.text('Mándanos el proyecto.', PAGE.mx, 60);
    setText(doc, [200, 170, 240]);
    doc.text('Devolvemos el sistema completo.', PAGE.mx, 76);

    // Bajada
    setText(doc, C.white);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const intro = 'Plano, render o sola descripción. En 24 horas devolvemos vidrio recomendado, sistema de aluminio compatible, precio por m² instalado y precio total del proyecto.';
    const introLines = doc.splitTextToSize(intro, CW - 30);
    doc.text(introLines, PAGE.mx, 90);

    // Bloques de contacto
    let blkY = 116;
    const blocks = [
      { lab: 'EMAIL',    val: 'cotizaciones@kinzal.ai', url: 'mailto:cotizaciones@kinzal.ai' },
      { lab: 'WHATSAPP', val: '33 3118 8097',            url: 'https://wa.me/523331188097' },
      { lab: 'CEL',      val: '33 1360 7178',            url: 'tel:+523313607178' },
    ];
    const blockW = CW / 3 - 4;
    blocks.forEach((b, i) => {
      const bx = PAGE.mx + i * (blockW + 6);
      setFill(doc, [40, 60, 140]);
      doc.roundedRect(bx, blkY, blockW, 32, 2, 2, 'F');
      setDraw(doc, C.violet);
      doc.setLineWidth(0.4);
      doc.line(bx, blkY, bx, blkY + 32);
      setText(doc, C.violet);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text(b.lab, bx + 5, blkY + 8);
      setText(doc, C.white);
      doc.setFont('helvetica', 'bold');
      // Auto-ajustar tamaño para que el texto quepa en una sola línea
      const fitWidth = blockW - 10;
      let valSize = b.val.length > 16 ? 11 : 14;
      doc.setFontSize(valSize);
      while (valSize > 8 && doc.getTextWidth(b.val) > fitWidth) {
        valSize -= 0.5;
        doc.setFontSize(valSize);
      }
      doc.text(b.val, bx + 5, blkY + 18);
      doc.link(bx, blkY, blockW, 32, { url: b.url });
    });

    // CTA grande "Ver catálogo interactivo"
    const ctaY = blkY + 50;
    setFill(doc, C.violet);
    doc.roundedRect(PAGE.mx, ctaY, CW, 22, 3, 3, 'F');
    setText(doc, C.white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('Ver catálogo interactivo completo  >', PAGE.w / 2, ctaY + 13.5, { align: 'center' });
    doc.link(PAGE.mx, ctaY, CW, 22, { url: ctx.catalogUrl });

    // Pie
    setText(doc, [180, 195, 230]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('© 2026 KINZAL · GUADALAJARA · HP TEMPLADOS · DISTRIBUIDOR AUTORIZADO SGG MX', PAGE.mx, PAGE.h - 14);
    setText(doc, C.white);
    doc.setFont('helvetica', 'bold');
    doc.text('kinzal.ai', PAGE.w - PAGE.mx, PAGE.h - 14, { align: 'right' });
    doc.link(PAGE.w - PAGE.mx - 30, PAGE.h - 18, 30, 6, { url: 'https://kinzal.ai' });
  }

  // ----- Pinta los footers tras cerrar todo el contenido -----
  function paintFooters(doc, ctx) {
    const total = doc.internal.getNumberOfPages();
    // Skip page 1 (cover) and last (cotización) for the standard footer
    for (let i = 2; i < total; i++) {
      doc.setPage(i);
      drawPageFooter(doc, ctx, i, total);
    }
  }

  // ----- Builder principal -----
  async function generatePDF() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      throw new Error('jsPDF no cargado. Verifica los CDN scripts en index.html.');
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    const ctx = getCtx();

    // 1 · Portada
    drawCover(doc, ctx);

    // 2 · Quiénes somos
    doc.addPage();
    let y = PAGE.mt;
    y = drawQuienesSomos(doc, ctx, y);

    // 3 · Necesidades (mismo pliego si entra)
    if (y > PAGE.h - PAGE.mb - 70) {
      doc.addPage();
      y = PAGE.mt;
    }
    y = drawNecesidades(doc, ctx, y);

    // 4 · Métricas
    if (y > PAGE.h - PAGE.mb - 80) {
      doc.addPage();
      y = PAGE.mt;
    }
    y = drawMetricas(doc, ctx, y);

    // 5 · Productos
    doc.addPage();
    y = drawProductos(doc, ctx, PAGE.mt);

    // 6 · Familias involucradas
    y = drawFamilias(doc, ctx, y);

    // 7 · Cotización (página propia + cierre marine)
    drawCotizacion(doc, ctx);

    // Footers interiores
    paintFooters(doc, ctx);

    doc.save(ctx.filename);
    if (typeof gtag === 'function') gtag('event', 'pdf_exportado', { archivo: ctx.filename, productos: ctx.products.length });
    return ctx.filename;
  }

  // Expose
  window.generatePDF = generatePDF;
})();
