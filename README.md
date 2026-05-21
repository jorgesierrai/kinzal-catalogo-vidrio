# Catálogo HP Templados × Saint-Gobain Glass México

Catálogo técnico-comercial de vidrio arquitectónico. Una sola página HTML, sin framework, sin servidor, sin build step. Se abre en el navegador y funciona.

---

## Qué es esto

HP Templados es fábrica y distribuidor autorizado de Saint-Gobain Glass México. Kinzal integra el aluminio, la perfilería y la instalación. Este catálogo es la interfaz entre ese sistema y quienes lo especifican: arquitectos, despachos y desarrolladores en CDMX, GDL y MTY.

61 vidrios. 16 familias técnicas. Entrada por necesidad — bajar el calor, asegurar un barandal, dar privacidad, aislar el ruido — salida con el vidrio correcto, el aluminio compatible y el precio instalado.

---

## Archivos

| Archivo | Responsabilidad |
|---|---|
| `index.html` | Estructura completa de la landing: hero, necesidades, catálogo, familias, sistema, CTA |
| `styles.css` | Sistema de diseño Kinzal. Paleta Marine `#1A2A6C` · Blue `#2E5BE0` · Violet `#9B3FD4`. Tres direcciones visuales (Editorial / Showroom / Ficha técnica), dos densidades, dos acentos |
| `productos.js` | `window.PRODUCTOS` — 61 productos con todas sus propiedades técnicas: TL, SHGC, U-Value, Selectividad, Reflexión ext/int, Coef. de sombra, templable, laminable, DGU, norma, dimensiones máximas |
| `app.js` | Toda la lógica: filtros, búsqueda, comparador (hasta 3 productos), drawer de ficha completa, popover de métricas, panel de tweaks, exportación. Expone `window.CATALOGO_API` |
| `pdf-export.js` | Generador de PDF construido con jsPDF + jspdf-autotable. Contexto-aware: adapta contenido y nombre de archivo según los filtros activos al momento de exportar |

No hay dependencias locales. jsPDF y jspdf-autotable se cargan desde CDN en `index.html`.

---

## Cómo usar

```bash
# Opción 1 — abrir directo
open index.html

# Opción 2 — servidor local (recomendado para que los links funcionen bien)
npx serve .
# o
python3 -m http.server 8080
```

Requiere conexión a internet únicamente para: tipografías de Google Fonts y los CDN de jsPDF.

---

## Catálogo interactivo

**Filtros** — por familia, capacidad (templable / laminable / DGU disponible), segmento y color. Combinables entre sí.

**Búsqueda libre** — busca en nombre, pitch comercial, beneficios, aplicaciones y necesidad del cliente.

**Necesidades** — 8 tarjetas de entrada. Cada una aplica el filtro de familia correspondiente y lleva al catálogo directamente.

**Comparador** — hasta 3 productos lado a lado. Métricas, configuración, capacidades. La celda con mejor valor se resalta en azul.

**Drawer de ficha** — especificaciones completas: SC, reflexión interior, espesor, dimensión máxima, norma, templable/laminable/DGU, aplicaciones, beneficios desglosados, necesidad del cliente y notas técnicas.

**Popovers de métrica** — TL, SHGC, U-Value, Selectividad y Reflexión Ext explicados en lenguaje plano con ejemplo concreto y rango típico. Enlace al glosario completo.

**Tweaks** — panel de dirección visual en tiempo real. Editorial (luminoso), Showroom (oscuro premium), Ficha técnica (denso, monoespaciado). Persiste en `localStorage`.

---

## Exportación a PDF

El botón **Exportar PDF** genera un documento desde cero — no es un `window.print()`.

El PDF es contexto-aware:

| Estado de filtros | Contenido | Nombre de archivo |
|---|---|---|
| Sin filtros | Catálogo completo — 61 vidrios, 16 familias, 8 necesidades | `Kinzal-Catalogo-Completo-SaintGobain-2026.pdf` |
| Filtro por necesidad exacta | Solo esa necesidad y sus familias | `Kinzal-Seleccion-[necesidad]-2026.pdf` |
| Filtro por familia única | Solo esa familia | `Kinzal-Seleccion-[familia]-2026.pdf` |
| Filtros combinados | Selección personalizada | `Kinzal-Seleccion-Personalizada-2026.pdf` |

Cuando hay filtros activos, el PDF incluye un badge en portada y una nota en el pie de cada página: *"Selección filtrada · Ver catálogo completo"* con link al catálogo en línea.

**Estructura del PDF:**
1. Portada — fondo Marine, patrón de grid, cifras del lote seleccionado
2. Quiénes somos — HP Templados + Kinzal, el sistema de 4 pasos, las 3 cifras clave
3. Necesidades — las relevantes para la selección actual
4. Métricas — TL, SHGC, U-Value, Selectividad, Reflexión Ext en tabla con ejemplo
5. Productos — agrupados por familia, con pitch comercial
6. Familias — descripción y cuándo elegir cada una
7. Cotización — cierre en Marine, datos de contacto clicables, link al catálogo en línea

---

## Métricas en el catálogo

| Sigla | Nombre | Lo que importa |
|---|---|---|
| TL | Transmisión luminosa | % de luz visible que entra. Alto = luminoso. |
| SHGC / g | Ganancia solar | Fracción de calor solar que entra. Bajo = menos AC. |
| U-Value | Aislamiento térmico | Conductancia (W/m²K). Bajo = mejor aislamiento. |
| Sel. | Selectividad (TL/SHGC) | > 1 = entra más luz que calor. > 2 = estado del arte. |
| Ref. Ext. | Reflexión exterior | % de luz que rebota hacia afuera. Alto = efecto espejo. |

---

## Contacto y cotización

**cotizaciones@kinzal.ai** · WhatsApp 33 3118 8097 · Cel 33 1360 7178

[kinzal.ai](https://kinzal.ai) · Guadalajara, México · HP Templados · Distribuidor autorizado SGG MX

---

© 2026 Kinzal · Todos los derechos reservados
