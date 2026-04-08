# WaveArg Front — Contexto para Claude

## Qué es este proyecto
E-commerce de iPhones y accesorios para el mercado argentino. Frontend en Next.js 16 conectado a un backend .NET. Pagos via MercadoPago.

## Stack
- **Next.js 16.2.2** (Turbopack), React 19, TypeScript
- **Tailwind CSS**, Radix UI, Sonner (toasts), react-hook-form
- **Auth**: JWT en cookie `auth-token`, Zustand, Google OAuth
- **API**: `src/lib/api.ts` — todos los servicios pasan por `fetchFromApi()`
- **Backend**: .NET, corre en `NEXT_PUBLIC_API_BASE` (dev: `http://localhost:5075/api`)

## Estructura clave
```
src/
  app/
    (public)/     → rutas públicas (layout con NavBar + Footer)
    admin/        → panel admin (protegido por rol en layout.tsx)
    api/          → route handlers (webhook MercadoPago)
  components/     → componentes compartidos
  interfaces/     → tipos de dominio (producto.ts, accesorio.ts, auth.ts)
  lib/
    api.ts        → todos los servicios y DTOs de la API
  context/        → CartContext, CompareContext
  store/          → useAuthStore (Zustand)
```

## Convenciones importantes
- Páginas que usan `useSearchParams()` deben ser **Server Components** que wrappeen en `<Suspense>` un Client Component separado (`*Content.tsx`). Ver `/products/page.tsx` como ejemplo.
- Los servicios en `api.ts` usan DTOs tipados — no usar `any`. Ver `CreateVarianteDTO`, `UpdateProductoDTO`, etc.
- Confirmaciones de eliminación en admin usan `AlertDialog` de Radix UI (no `window.confirm()`).
- Toasts con `sonner` — no usar `alert()`.
- Módulo accesorios es paralelo al de productos — mismos patrones, con `CategoriaAccesorio` enum en vez de campos de iPhone.

## Variables de entorno
```
NEXT_PUBLIC_API_BASE      # URL del backend (.NET)
NEXT_PUBLIC_SITE_URL      # URL pública del frontend (para MercadoPago back_urls)
NEXT_PUBLIC_GOOGLE_CLIENT_ID
```
En producción crear `.env.production` con las URLs reales.

## Pendientes para producción
- Definir hosting → configurar `.env.production`
- Validación de firma en webhook MercadoPago (cuando tengan `MERCADOPAGO_WEBHOOK_SECRET`)
- Metadata dinámica en `/products/[id]` y `/accesorios/[id]` (requiere convertir a Server Components)
- Carrito backend, editar perfil, olvidé contraseña (backlog — sin endpoints en .NET aún)

## Dominios de imagen permitidos (next.config.ts)
- `store.storeimages.cdn-apple.com`, `www.apple.com` (Apple)
- `http2.mlstatic.com` (MercadoLibre)
- `www.sagitariodigital.com.ar`
- Agregar banco de fotos cuando se defina (Unsplash, Pexels, Cloudinary, etc.)
