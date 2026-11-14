# WaveArg Front — Contexto para Claude

## Qué es este proyecto
E-commerce de iPhones y accesorios para el mercado argentino. Frontend en Next.js 16 conectado a un backend .NET. Pagos via MercadoPago.

## Stack
- **Next.js 16.4** (Turbopack), React 19, TypeScript
- **Tailwind CSS v4** (`@import "tailwindcss"`), Radix UI (también para dropdowns: no usar headlessui), Sonner (toasts), react-hook-form, framer-motion
- **Auth**: JWT en cookie `auth-token`, Zustand, Google OAuth
- **Tests**: Vitest (`npm test`), archivos `src/**/*.test.ts`. Cubren `lib/`, `schemas/` y `proxy.ts`
- **API**: `src/lib/api.ts` — todos los servicios pasan por `fetchFromApi()` → proxy `/api/backend`
- **Backend**: .NET, producción en `https://waveargdefinitivo.onrender.com/api`, dev en `http://localhost:5075/api`
- **Hosting**: Frontend → Vercel (`https://wavearg-front.vercel.app`), Backend → Render
- **`react-icons` fue eliminado del proyecto** — no reinstalar

## Estructura clave
```
src/
  app/
    (public)/               → rutas públicas (layout con NavBar + Footer)
      products/[id]/        → Server Component con generateMetadata dinámica ✅
      accesorios/[id]/      → Server Component con generateMetadata dinámica ✅
      account/              → profile/, settings/, orders/ (solo usuarios autenticados)
      checkout/             → success/, failure/, pending/
      cart/                 → carrito de compras
      compare/              → comparador de productos
      login/, register/     → autenticación
      olvide-mi-contrasena/, reset-password/ → recuperación de contraseña
      contacto/, creadores/, nosotros/
      terminos/, privacidad/, arrepentimiento/ → páginas legales (texto pendiente del cliente, usan components/PaginaLegal)
    admin/                  → panel admin (protegido por proxy.ts + rol admin)
      productos/, accesorios/, orders/, users/
      components/           → AdminShell, AdminSideBar, AdminHeader, Dashboard, DataGrid, MetridCard, TableVariants, TableAccesorioVariants
      types/product.ts
    api/
      auth/session/         → POST/DELETE para manejar cookie auth-token (httpOnly)
      backend/[...path]/    → proxy universal hacia el backend .NET
      mercadopago/webhook/  → webhook MP con validación HMAC implementada ✅
  components/
    TarjetaDeModelo.tsx     → tarjeta de un modelo de iPhone (home y catálogo): precio desde, cuotas, unidades, link a la ficha con ?v=
    icons/
      BrandIcons.tsx        → InstagramIcon, TikTokIcon, WhatsAppIcon (SVG inline — lucide no tiene íconos de marca)
    home/                   → home "Parte de olas": HeroVideo, ParteEnVivo, ParteDeStock, FraseDeMarca, FormularioAvisos, Reveal, LineaOla, estilos.ts (clases compartidas)
  hooks/          → custom hooks
  interfaces/     → tipos de dominio (producto.ts, accesorio.ts, auth.ts)
  schemas/        → validación con Zod (auth.schema.ts, lead.schema.ts)
  lib/
    api.ts        → todos los servicios y DTOs de la API
    jwt.ts        → decodificación JWT sin validación de firma (sólo client-side, para la UI)
    sesion.ts     → verificarSesion(): firma HS256, vencimiento, issuer y audience (server-side)
    auth-cookie.ts → nombre y opciones de la cookie auth-token (única definición)
    backend.ts    → BACKEND_API_BASE para código server-side (route handlers, server components, sitemap)
    colorMap.ts   → mapeo de nombres de colores a valores hex
    catalogo.ts   → filtros y orden de /products (viven en la URL) y opciones de filtro sacadas del stock
    configurador.ts → configurador de la ficha: estado → color → capacidad, variante del link (?v=)
    especificaciones.ts → specs por modelo de iPhone para la ficha (tabla a mano; modelo desconocido = no se muestran)
    home.ts       → datos de la home: tarjetas por modelo, filas del parte, hora de lectura
    cuotas.ts     → CUOTAS_SIN_INTERES (null hasta que el cliente confirme) y textoCuotas()
    leads.ts      → avisos de stock de la home: por WhatsApp o POST /Leads según NEXT_PUBLIC_LEADS_API
    vendedor.ts   → datos del vendedor para el footer y las páginas legales (null = pendiente)
  context/        → CartContext (localStorage), CompareContext (memoria)
  store/          → useAuthStore (Zustand)
  proxy.ts        → protección de rutas por JWT y rol (ex middleware.ts; Next 16 renombró la convención). Va en src/ (no en la raíz): con src/app, Next lo ignora en la raíz. No confundir con el proxy /api/backend
```

## Autenticación y autorización
- `src/proxy.ts` verifica la firma del JWT (`lib/sesion.ts`, con `JWT_SECRET`), maneja redirecciones y protege rutas por rol (primera capa)
- `app/admin/layout.tsx` hace una segunda validación server-side (segunda capa) antes de renderizar el panel
- El token vive **solo en la cookie** `auth-token` (httpOnly). Zustand persiste `user` e `isLoggedIn` en localStorage, pero **nunca el token** — la cookie es la única fuente de verdad para `fetchFromApi` y `proxy.ts`
- Rutas públicas: `/`, `/login`, `/register`, `/products`, `/accesorios`, `/creadores`, `/nosotros`, `/contacto`, `/compare`
- Rutas protegidas: `/account`, `/admin`, `/cart`, `/checkout`
- La comparación de rol es **case-insensitive en todo el proyecto**: `rol?.toLowerCase() === "admin"`. No usar `=== "Admin"`.
- Al recargar la página, `token` en Zustand es siempre `null`; la auth funciona por la cookie, no por Zustand

## Convenciones importantes
- Páginas que usan `useSearchParams()` deben ser **Server Components** que wrappeen en `<Suspense>` un Client Component separado (`*Content.tsx`). Ver `/products/page.tsx` como ejemplo.
- Los servicios en `api.ts` usan DTOs tipados — no usar `any`. Ver `CreateVarianteDTO`, `UpdateProductoDTO`, etc.
- Confirmaciones de eliminación en admin usan `AlertDialog` de Radix UI (no `window.confirm()`).
- Toasts con `sonner` — no usar `alert()`.
- Módulo accesorios es paralelo al de productos — mismos patrones, con `CategoriaAccesorio` enum en vez de campos de iPhone.
- **Tailwind v4**: custom colors SIEMPRE en `@theme inline` en globals.css con valores directos (hex), no en tailwind.config.js ni solo en `:root`.
- Iconos: `lucide-react` con `strokeWidth=1.75` como estándar. Para íconos de marca (Instagram, TikTok, WhatsApp) usar `src/components/icons/BrandIcons.tsx` — **no reinstalar react-icons**.
- `GoogleLoginButton` siempre se importa con `dynamic(..., { ssr: false })` — no renderiza en servidor.
- El proxy `/api/backend/[...path]` reenvía las requests al backend .NET incluyendo el token desde la cookie. **No llamar al backend directamente desde el cliente** — siempre pasar por `fetchFromApi()`.
- Los productos destacados en la home se almacenan con `localStorage` key `wave-featured-product-id` (elegido desde admin). Ojo: localStorage es del navegador del admin, así que no aplica a los clientes; la home ya no lo usa (muestra el parte de stock). Para que el destacado valga para todos tiene que guardarse en el back.
- El id de CartItem tiene formato `"entityId-varianteId"`. El checkout parsea este formato para extraer `varianteId` y construir el payload de MercadoPago.
- `CartItem` incluye `stock?: number`. Siempre pasarlo al llamar `addToCart()` para que el carrito pueda respetar el límite de stock en el botón `+`.
- `CartContext` hidrata desde localStorage con try-catch — si los datos están corruptos, los limpia y arranca vacío.

## Variables de entorno
```
NEXT_PUBLIC_API_BASE           # URL del backend (.NET)
INTERNAL_API_BASE              # Opcional: URL del backend solo para el servidor de Next (pisa a la anterior)
NEXT_PUBLIC_API_PROXY_BASE     # Opcional: base que usa el cliente (default /api/backend)
BACKEND_PROXY_SECRET           # Secreto compartido con el backend (Proxy__ClientIpSecret) para reenviar la IP del cliente
JWT_SECRET                     # Misma clave que Jwt__Key del backend: proxy.ts y layout de admin verifican la firma del token
BACKEND_TIMEOUT_MS             # Opcional: timeout del proxy /api/backend en ms (default 30000); vencido responde 504
NEXT_PUBLIC_SITE_URL           # URL pública del frontend (para MercadoPago back_urls)
NEXT_PUBLIC_LEADS_API          # Opcional: "true" cuando el back tenga POST /Leads. Sin eso, el formulario de avisos de la home sale por WhatsApp
NEXT_PUBLIC_GOOGLE_CLIENT_ID
MERCADOPAGO_WEBHOOK_SECRET     # Para validar firma HMAC del webhook (producción)
```
`.env.production` ya existe con las URLs de Vercel y Render. Plantilla completa en `.env.example`.

## Estado de producción

### Completo ✅
- Metadata dinámica en `/products/[id]` y `/accesorios/[id]` — implementada con `generateMetadata`
- `.env.production` configurado (Vercel + Render)
- Rutas de recuperación de contraseña (`/olvide-mi-contrasena`, `/reset-password`)
- Webhook MercadoPago: validación HMAC con `createHmac("sha256", secret)` implementada en `src/app/api/mercadopago/webhook/route.ts`
- Admin CRUD completo: productos, accesorios, variantes (con imágenes), pedidos (con cambio de estado inline), usuarios
- Admin dashboard: tabla "Pedidos Recientes" conectada con `PedidosService.getAll()` (8 más recientes, orden desc)
- Perfil: edición inline de `nombre` usando `UsuariosService.updateMe` — funcional si el backend tiene `PUT /Usuarios/{id}`
- Cambio de contraseña en `/account/settings` — funcional
- Comparación de rol case-insensitive en todo el proyecto (`rol?.toLowerCase() === "admin"`)
- Checkout: `clearCart()` se ejecuta solo en `/checkout/success`, no al crear la preferencia de MP
- Carrito: botón `+` respeta el stock de la variante — se deshabilita al alcanzar el límite
- Auth proxy: `POST /api/auth/session` setea cookie httpOnly con maxAge derivado del `exp` del JWT; `DELETE` la borra. `useAuthStore.setAuth()` llama este endpoint, nunca persiste el token en localStorage
- Proxy backend: `/api/backend/[...path]` reenvía todas las requests al .NET adjuntando el token de la cookie como `Authorization: Bearer`
- Home "Parte de olas" (DESIGN.md), pensada para vender y captar contactos: hero con titular en HTML y video en loop, bloque de confianza, stock de hoy en tarjetas por modelo con datos reales, frase de marca, cómo es comprar, testimonios como chat, formulario de avisos, FAQ y cierre
- Footer con datos del vendedor, Términos, Privacidad y botón de arrepentimiento

- Chat de ayuda (`ChatAyuda`): chat de preguntas frecuentes con respuestas automáticas (sin IA ni backend) que usa `PREGUNTAS`/`GRUPOS` de `faq-datos.tsx` (compartidos con `FAQSection`). Convive con el botón flotante de WhatsApp (no lo reemplaza); su lanzador (ícono + "¿Dudas?") asoma desde el borde derecho, arriba del de WhatsApp, y se agita cada 90 s hasta que se abre por primera vez (no con reduced-motion)

### Pendiente de backend 📋 (confirmado bloqueado — revisado con Swagger)
- **Eliminar cuenta**: NO existe `DELETE /Usuarios/{id}` en el backend (solo `GET /Usuarios`). El botón en settings queda con `toast.info("Próximamente")` hasta que el backend lo implemente
- **Dirección de envío**: ✅ Implementada. El endpoint ahora acepta `CrearPreferenciaRequestDto { items, direccionEnvio }`. El checkout solicita calle, ciudad, provincia y CP antes de redirigir a MP.
- **Avisos de stock (leads)**: no existe `POST /Leads`. El formulario de la home (`FormularioAvisos`) manda el pedido por WhatsApp hasta que exista; después se prende con `NEXT_PUBLIC_LEADS_API=true`. Cuerpo que manda: `{ email, modelo, whatsapp, origen: "home" }`
- **Arrepentimiento**: `/arrepentimiento` pide la baja por WhatsApp o mail. Falta un endpoint que registre la solicitud y devuelva su código
- **Notificaciones**: No hay ningún endpoint en el backend. Los toggles en settings muestran badge "Próximamente", contador en perfil hardcodeado a `0`

### Bugs conocidos pendientes 🐛
- Fetches de productos sin caché: `getProductos()` se llama de forma independiente en catálogo y detalle (para sugeridos). En la home, una sola request cacheada (`hooks/useProductosHome`)

### Mejoras de UI pendientes 📋
- **FAQSection** ✅ refactorizada: datos en una lista y estilo del sistema "Precisión"

### Decisiones de diseño para MVP 📋
- Carrito queda en localStorage (sin sincronización con backend)

### Pendiente del cliente 📋
- Cuotas sin interés (`CUOTAS_SIN_INTERES` en `lib/cuotas.ts`), datos del vendedor (`lib/vendedor.ts`) y textos legales: ver "Pendiente del cliente" en DESIGN.md

### Atención ⚠️
- No existe ruta `/mayorista` como página en el App Router, aunque proxy.ts la lista como ruta pública.

## Dominios de imagen permitidos (next.config.ts)
- `store.storeimages.cdn-apple.com`, `www.apple.com` (Apple)
- `http2.mlstatic.com` (MercadoLibre)
- `www.sagitariodigital.com.ar`
- Agregar banco de fotos cuando se defina (Unsplash, Pexels, Cloudinary, etc.)

## Agent skills

### Issue tracker

GitHub Issues de `MarcosGP20/WaveArg-front` (los que tocan back y front van en `MarcosGP20/WAVEARGDEFINITIVO`), con `gh`. See `docs/agents/issue-tracker.md`.

### Triage labels

Las cinco etiquetas por defecto: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` y `docs/adr/` en la raíz del repo. See `docs/agents/domain.md`.
