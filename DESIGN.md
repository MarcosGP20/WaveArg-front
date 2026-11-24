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
| `atlantico` | `#0B2533` | Fondo del hero y el cierre de la home: el Atlántico frío, no negro |
| `espuma` | `#EEF2F0` | Texto sobre `atlantico` y fondos claros de la home |
| `guardavidas` | `#F2611D` | Sólo datos en vivo (hora del parte, "quedan pocas") y sólo sobre `atlantico` (5:1) |
| `bruma` | `#9B9B9B` | Fin del degradé del titular del hero (blanco → bruma). Es el único degradé de la home |
| `radius-control` | `12px` | Botones, inputs, opciones |
| `radius-panel` | `20px` | Paneles y tarjetas |

No se usan hex sueltos en componentes nuevos: si falta un color, se agrega acá y en `@theme`.

## Tipografía

**Geist** (`next/font`) para el texto y **Archivo** (`font-display`, con eje de ancho `wdth`) para los títulos de la home.

- Título de página: 40–44px, semibold, `tracking-tight`.
- Título de sección: 28px, semibold.
- Precio: 32px, semibold, `tabular-nums`.
- Cuerpo: 16px; secundario 14–15px en `tinta-suave`; mínimo 13px.
- Sin MAYÚSCULAS en botones ni labels largos.

En la home el texto usa **estilos con nombre** (definidos en `globals.css` con `@utility`): cada uno es
un escalón de la escala de Tailwind con su interlineado, así no quedan tamaños sueltos.

- `heading-1` a `heading-6` (60, 48, 36, 30, 24 y 20px): Archivo semibold. Se bajan con breakpoints
  (`heading-4 md:heading-3 lg:heading-2`). El titular del hero es `heading-1` en desktop.
- `title-1` a `title-4` (20, 18, 16 y 14px, medium): títulos de tarjeta y de ítem.
- `body-1` a `body-7`: texto corrido de 16px (1 a 3), 14px (4 a 6) y 18px (7).
- `button-lg`, `button-md`, `button-sm`: sólo dentro de botones. `caption-1` y `caption-2`: 14px.
- Peso máximo semibold. Sin itálicas.
- Espaciados de la home: sólo 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80 y 96px.

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

Todo lo que se mueve en la home usa la misma curva, que llega frenando (`ease-ola`,
`cubic-bezier(0.22, 1, 0.36, 1)`), y sólo anima `transform` y `opacity`:

- **Hero**: el video del teléfono en el mar, en loop. Se puede pausar; con reduced-motion queda el poster.
- **Entrada de secciones** (`Reveal`): suben 32px y aparecen en 700ms, una sola vez, al entrar en
  pantalla. Sólo se oculta lo que está debajo de la pantalla y sólo si corre el JS: sin JS se ve todo.
  Con reduced-motion no hay desplazamiento, sólo la opacidad.
- **Frase de marca** (`FraseDeMarca`): las palabras se encienden de a una al scrollear. Con
  reduced-motion el texto está entero desde el principio.
- **Hover**: 300ms. Los botones se hunden apenas al apretarlos (`active:scale-[0.98]`).

Otra excepción, por pedido del cliente: el lanzador del chat de ayuda se agita cada 90 s hasta que se abre
por primera vez (respeta `prefers-reduced-motion`).

## Identidad de la home: "Parte de olas"

Wave es de Necochea y Mar del Plata, con una ola en el logo. En la costa, el parte de olas dice cómo
está el mar: preciso, con la hora, sin vueltas. La home muestra el stock igual.

La home tiene dos trabajos, en este orden: **vender** y **captar a quien todavía no compra**. Cada
sección tiene una sola acción principal. De arriba hacia abajo:

- **Hero** (sobre `atlantico`): titular en HTML con el degradé blanco → `bruma`, la acción principal
  ("Ver iPhones en stock") y la captación como link ("Avisame de nuevos ingresos"). La prueba es un
  dato en vivo en `guardavidas` (`ParteEnVivo`: cuántos equipos hay y a qué hora se leyó). Al lado,
  `HeroVideo`: el teléfono flotando en el mar, sin texto adentro. El fuente del video es un proyecto
  de HyperFrames que está fuera del repo (`video/wave-hero/square`).
- **Confianza**: garantía, envíos, Mercado Pago y atención. Sólo lo que Wave ya promete en la ficha,
  el FAQ y /contacto.
- **Parte de stock** (`ParteDeStock`, "En stock hoy"): una tarjeta por modelo con el precio más bajo,
  la línea de cuotas (`lib/cuotas.ts`), las unidades que quedan y la hora de lectura. Cada tarjeta
  lleva a la ficha con esa variante (`?v=`). Filtro nuevos/usados sólo si hay de los dos. Datos del
  back, nada escrito a mano.
- **Frase de marca**: la promesa, en grande, que se enciende al scrollear.
- **Cómo es comprar**: tres pasos numerados (es una secuencia real) unidos por `LineaOla`, y el plan
  canje como link.
- **Testimonios** como burbujas de chat, porque son mensajes de Instagram.
- **Avisos** (`FormularioAvisos`, sobre `atlantico`): el formulario para quien no compra hoy. Sólo
  el email es obligatorio. Siempre dice qué pasó con el dato: guardado, error o "falta mandar el
  mensaje por WhatsApp" (ver `lib/leads.ts`).
- **Preguntas frecuentes** y **cierre** con la misma acción del hero. El cierre va en `atlantico`
  pegado al footer, también `atlantico`.
- **`LineaOla`**: la ola del logo reemplaza las líneas rectas como separador (pasos y footer).
- El **footer** lleva los datos del vendedor (`lib/vendedor.ts`), Términos, Privacidad y el botón de
  arrepentimiento, que la ley pide a la vista en la página de inicio.

Evitar en la home (se ven como plantilla): numeración 01/02/03 si no es una secuencia, etiquetas
sobre cada título, datos unidos con " · ", flechas agregadas a los links, una palabra del título en
otro color, y tarjetas iguales para todo.

## Catálogo y ficha

- **Tarjeta de modelo** (`TarjetaDeModelo`): la misma en la home y en /products. Panel `superficie`,
  foto fundida, estado, "Desde" con el precio más bajo de lo que hay (o de lo filtrado), cuotas y
  "Comprar". Toda la tarjeta lleva a la ficha con esa variante (`?v=`). Comparar va fuera del link.
  Las tarjetas de accesorios usan el mismo lenguaje.
- **Catálogo**: filtros y orden en la URL. Las opciones de capacidad y modelo salen del stock, no de
  una lista fija. Una variante tiene que cumplir todos los filtros a la vez.
- **Ficha**: configurador estado → color → capacidad; lo que no hay se ve deshabilitado. Sin stock,
  ofrece el aviso por WhatsApp. Las especificaciones salen de `lib/especificaciones.ts`; si el
  modelo no está en la tabla, no se muestran.

## Accesibilidad

Objetivo WCAG 2.2 AA: contraste 4,5:1 en texto (incluidos los grises chicos), targets de 44px,
foco visible, `aria-pressed` en opciones, `fieldset`/`legend` para grupos de opciones.

## Pendiente del cliente

- Fotos de cada modelo y color (frente, dorso, lateral, caja), fondo blanco o transparente.
- Si los precios se muestran en ARS, USD o ambos.
- Cuántas cuotas sin interés ofrece Wave: va en `CUOTAS_SIN_INTERES` (`lib/cuotas.ts`). Mientras sea
  `null`, el sitio dice "En cuotas con Mercado Pago" y no promete ninguna cifra.
- Número de WhatsApp de ventas: el botón flotante y el footer usan el de `lib/whatsapp.ts`; /contacto
  usa otro.
- Datos del vendedor (`lib/vendedor.ts`): razón social, CUIT y domicilio legal. Hasta que lleguen se
  ven como "[pendiente]" en el footer y en las páginas legales.
- Textos de Términos y condiciones y de Política de privacidad, y cómo se devuelve el equipo y el
  dinero en un arrepentimiento. Las tres páginas están marcadas como "Texto pendiente".
