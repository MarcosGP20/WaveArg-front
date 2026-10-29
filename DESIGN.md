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

Lo único que se mueve solo es el hero: la ola tipográfica del titular (una vez, al cargar) y el
teléfono 3D. El resto de la página queda quieto: nada de fade-in en cada sección.

## Identidad de la home: "Parte de olas"

Wave es de Necochea y Mar del Plata, con una ola en el logo. En la costa, el parte de olas dice cómo
está el mar: preciso, con la hora, sin vueltas. La home muestra el stock igual.

- **Hero en `atlantico`**: titular "Tu próximo iPhone, hoy en stock." en Archivo, con una ola que
  recorre las letras ensanchando `wdth` (`TituloOla`).
- **Teléfono 3D** (`TelefonoOla` + `lib/telefono3d.ts`, three.js con import dinámico): modelo
  estilizado armado en código, cuya pantalla es una ola animada. Gira con el puntero y con el
  scroll. Sin WebGL queda una foto; con reduced-motion, un cuadro quieto.
- **Parte de stock** (`ParteDeStock`): modelo, estado, unidades y precio reales, con la hora de
  lectura. Datos en lugar de adjetivos.
- **`LineaOla`**: la ola del logo reemplaza las líneas rectas como separador.

Evitar en la home (se ven como plantilla): numeración 01/02/03 si no es una secuencia, etiquetas
sobre cada título, datos unidos con " · ", flechas agregadas a los links, una palabra del título en
otro color, y tarjetas iguales para todo.

## Accesibilidad

Objetivo WCAG 2.2 AA: contraste 4,5:1 en texto (incluidos los grises chicos), targets de 44px,
foco visible, `aria-pressed` en opciones, `fieldset`/`legend` para grupos de opciones.

## Pendiente del cliente

- Fotos de cada modelo y color (frente, dorso, lateral, caja), fondo blanco o transparente.
- Si los precios se muestran en ARS, USD o ambos, y si hay cuotas.
- Número de WhatsApp de ventas: el botón flotante, el footer y /contacto usan números distintos.
