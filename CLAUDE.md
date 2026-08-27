# WaveArg Front — Contexto para Claude

## Qué es este proyecto
E-commerce de iPhones y accesorios para el mercado argentino. Frontend en Next.js 16 conectado a un backend .NET. Pagos via MercadoPago.

## Stack
- **Next.js 16.2.2** (Turbopack), React 19, TypeScript
- **Tailwind CSS v4** (`@import "tailwindcss"`), Radix UI, Sonner (toasts), react-hook-form, framer-motion
- **Auth**: JWT en cookie `auth-token`, Zustand, Google OAuth
- **API**: `src/lib/api.ts` — todos los servicios pasan por `fetchFromApi()`
- **Backend**: .NET, producción en `https://waveargdefinitivo.onrender.com/api`, dev en `http://localhost:5075/api`
- **Hosting**: Frontend → Vercel (`https://wavearg-front.vercel.app`), Backend → Render

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
    admin/                  → panel admin (protegido por middleware.ts + rol admin)
      productos/, accesorios/, orders/, users/
      components/           → AdminShell, AdminSideBar, AdminHeader, Dashboard, DataGrid, MetridCard, TableVariants, TableAccesorioVariants
      types/product.ts
    api/
      auth/session/         → POST/DELETE para manejar cookie auth-token (httpOnly)
      backend/[...path]/    → proxy universal hacia el backend .NET
      mercadopago/webhook/  → webhook MP con validación HMAC implementada ✅
  components/     → componentes compartidos
  hooks/          → custom hooks
  interfaces/     → tipos de dominio (producto.ts, accesorio.ts, auth.ts)
  schemas/        → validación con Zod (auth.schema.ts)
  lib/
    api.ts        → todos los servicios y DTOs de la API
    jwt.ts        → decodificación JWT sin validación de firma (client-side)
    colorMap.ts   → mapeo de nombres de colores a valores hex
  context/        → CartContext (localStorage), CompareContext (memoria)
  store/          → useAuthStore (Zustand)
middleware.ts     → (raíz) protección de rutas por JWT y rol — NO en layout.tsx
```

## Autenticación y autorización
- `middleware.ts` en la raíz valida JWT, maneja redirecciones y protege rutas por rol (primera capa)
- `app/admin/layout.tsx` hace una segunda validación server-side (segunda capa) antes de renderizar el panel
- El token vive **solo en la cookie** `auth-token` (httpOnly). Zustand persiste `user` e `isLoggedIn` en localStorage, pero **nunca el token** — la cookie es la única fuente de verdad para `fetchFromApi` y el middleware
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
- Iconos: `lucide-react` con `strokeWidth=1.75` como estándar.
- `GoogleLoginButton` siempre se importa con `dynamic(..., { ssr: false })` — no renderiza en servidor.
- El proxy `/api/backend/[...path]` reenvía las requests al backend .NET incluyendo el token desde la cookie. **No llamar al backend directamente desde el cliente** — siempre pasar por `fetchFromApi()`.
- Los productos destacados en la home se almacenan con `localStorage` key `wave-featured-product-id` (elegido desde admin).
- El id de CartItem tiene formato `"entityId-varianteId"`. El checkout parsea este formato para extraer `varianteId` y construir el payload de MercadoPago.
- `CartItem` incluye `stock?: number`. Siempre pasarlo al llamar `addToCart()` para que el carrito pueda respetar el límite de stock en el botón `+`.
- `CartContext` hidrata desde localStorage con try-catch — si los datos están corruptos, los limpia y arranca vacío.

## Variables de entorno
```
NEXT_PUBLIC_API_BASE           # URL del backend (.NET)
NEXT_PUBLIC_SITE_URL           # URL pública del frontend (para MercadoPago back_urls)
NEXT_PUBLIC_GOOGLE_CLIENT_ID
MERCADOPAGO_WEBHOOK_SECRET     # Para validar firma HMAC del webhook (producción)
```
`.env.production` ya existe con las URLs de Vercel y Render.

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

### Pendiente de backend 📋
- Notificaciones: toggles en settings muestran badge "Próximamente", contador en perfil hardcodeado a `0`
- Eliminar cuenta: botón en settings llama `toast.info("Función disponible próximamente.")` — no implementado
- Dirección de envío: el modelo `Pedido` tiene `direccionEnvio` pero no hay UI en el checkout para capturarla

### Bugs conocidos pendientes 🐛
- Race condition en cambio rápido de variante en ProductDetailContent: `switchVariante` usa `setTimeout(150ms)` sin cancelar timeouts anteriores — el estado puede quedar desincronizado si el usuario cambia variantes muy rápido
- Fetches de productos sin caché: `getProductos()` se llama de forma independiente en home, catálogo y detalle (para sugeridos) — cada navegación dispara un fetch nuevo al backend

### Decisiones de diseño para MVP 📋
- Carrito queda en localStorage (sin sincronización con backend)

### Atención ⚠️
- No existe ruta `/mayorista` como página en el App Router, aunque el middleware la lista como ruta pública.

## Dominios de imagen permitidos (next.config.ts)
- `store.storeimages.cdn-apple.com`, `www.apple.com` (Apple)
- `http2.mlstatic.com` (MercadoLibre)
- `www.sagitariodigital.com.ar`
- Agregar banco de fotos cuando se defina (Unsplash, Pexels, Cloudinary, etc.)
