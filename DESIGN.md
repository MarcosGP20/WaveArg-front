# Sistema visual de Wave

Dirección elegida: **Precisión** (propuesta B del canvas de direcciones, octubre 2026). Sobria y
cercana a cómo se ve Apple: fondo blanco, superficies gris claro, tinta casi negra y el azul de
Wave reservado para lo que importa. La confianza la da la claridad, no la decoración.

## Principio de negocio

**La venta se concreta en la web.** En cada pantalla de compra hay una sola acción principal
(agregar al carrito, ir a pagar, pagar). WhatsApp es ayuda secundaria: un link de texto
("¿Tenés dudas? Escribinos por WhatsApp"), nunca un botón del mismo peso que comprar.

## Tokens (`@theme inline` en `src/app/globals.css`)

| Token | Valor | Uso |
|---|---|---|
| `tinta` | `#1D1D1F` | Texto principal, títulos |
| `tinta-suave` | `#6E6E73` | Texto secundario, labels (4,7:1 sobre `superficie`) |
| `superficie` | `#F5F5F7` | Paneles: galería, precio, tarjetas de specs |
| `borde` | `#E8E8ED` | Divisores y bordes de reposo |
| `borde-fuerte` | `#D2D2D7` | Bordes de controles (botones secundarios, opciones) |
| `color-principal` | `#05467D` | Acción principal, selección, links |
| `principal-suave` | `#E8F0F7` | Fondo de badges de marca |
| `exito` | `#1F6B3A` | Stock disponible |
| `noche` | `#0B0B0C` | Fondo de secciones oscuras (hero y cierre de la home) |
| `noche-2` | `#1C1C1E` | Superficies sobre `noche` (tarjeta de compra, palabra gigante) |
| `noche-borde` | `#2C2C2E` | Bordes sobre `noche` |
| `niebla` | `#A1A1A6` | Texto secundario sobre `noche` (8:1) |
| `radius-control` | `12px` | Botones, inputs, opciones |
| `radius-panel` | `20px` | Paneles y tarjetas |

No se usan hex sueltos en componentes nuevos: si falta un color, se agrega acá y en `@theme`.

## Tipografía

**Geist** (`next/font`) en todo el sitio, sin segunda familia.

- Título de página: 40–44px, semibold, `tracking-tight`.
- Título de sección: 28px, semibold.
- Precio: 32px, semibold, `tabular-nums`.
- Cuerpo: 16px; secundario 14–15px en `tinta-suave`; mínimo 13px.
- Sin MAYÚSCULAS en botones ni labels largos.

## Componentes

- **Acción principal**: fondo `color-principal`, texto blanco, 56px de alto, `rounded-control`.
  Una por pantalla.
- **Secundaria**: borde `borde-fuerte`, fondo blanco, misma altura que la principal o menor.
- **Opción seleccionable** (capacidad, filtros): borde 1px `borde-fuerte`; seleccionada, 2px
  `color-principal`. Nunca relleno azul para una opción.
- **Swatch de color**: 44px, círculo con aro de 2px `color-principal` al seleccionar.
- **Panel**: `bg-superficie rounded-panel`, sin sombra.
- **Lista de garantías** (envío, garantía, canje): caja con borde `borde`, ícono lucide en
  `color-principal`, texto en una línea.
- Íconos: `lucide-react`, `strokeWidth={1.75}`.
- Fotos de producto sobre `superficie` con `mix-blend-multiply`: el fondo blanco de los JPG
  desaparece en vez de quedar como un rectángulo.

## Movimiento

Transiciones de 150–250ms en estados (hover, selección). Nada que tape contenido mientras anima.
Todo respeta `prefers-reduced-motion`.

El movimiento atado al scroll es **CSS** (`animation-timeline: view()`), no JS: clases `.revelar`
(entrada de títulos y bloques) y `.hero-pulso-*` en `globals.css`. El estado base es el final, así
que sin soporte del navegador o con reduced-motion todo se ve quieto y completo.

## Home "Pulso"

Hero oscuro con la palabra "iPhone" gigante detrás del equipo y una tarjeta de compra real (stock,
precio, agregar al carrito): se puede comprar sin pasar por el catálogo. Títulos de sección grandes
(72px, tracking muy cerrado), bloques de `rounded-[32px]` y rieles horizontales con scroll-snap.

## Accesibilidad

Objetivo WCAG 2.2 AA: contraste 4,5:1 en texto (incluidos los grises chicos), targets de 44px,
foco visible, `aria-pressed` en opciones, `fieldset`/`legend` para grupos de opciones.

## Pendiente del cliente

- Fotos de cada modelo y color (frente, dorso, lateral, caja), fondo blanco o transparente.
- Si los precios se muestran en ARS, USD o ambos, y si hay cuotas.
- Número de WhatsApp de ventas: el botón flotante, el footer y /contacto usan números distintos.
