# Auditoría técnica — Wave ARG E-commerce

## Resumen ejecutivo

Proyecto **Next.js 15** (App Router) + **React 19** con backend .NET. Hay una base sólida (auth con JWT/cookie, middleware, layouts, catálogo, carrito, checkout, admin), pero **varios bugs críticos** y **deuda técnica** que conviene atacar en este orden.

---

## 1. Estructura del frontend

### Lo que está bien
- **App Router** con route groups: `(public)` para tienda y `admin` para panel.
- **Paths** `@/*` → `./src/*` en `tsconfig`.
- **Componentes**: `src/components` (NavBar, ProductCards, etc.) y `src/components/ui` (shadcn: Button, Input, etc.).
- **Interfaces** en `src/interfaces` (auth, producto); **schemas** en `src/schemas` (Zod).
- **API** centralizada en `src/lib/api.ts` con `fetchFromApi`, servicios (ProductService, login, register).

### Problemas
| Problema | Ubicación | Impacto |
|----------|-----------|---------|
| **Dos flujos de productos en admin** | `admin/products/*` y `admin/productos/*` | Duplicación, confusión, mantenimiento costoso. |
| **Nombre de archivo vs componente** | `FilterSide.tsx` exporta `FilterSidebar` | Inconsistencia; el import es `FilterSidebar from "@/components/FilterSide"`. |
| **CompareContext** importa `Producto` desde `@/lib/api` | Debería usar `@/interfaces/producto` para no acoplar a la capa API. |
| **next.config.ts** | `hostname: "http2.mlstatic.com"` es incorrecto (debería ser `mlstatic.com`); falta `pathname: "/**"` en ese bloque. | Imágenes de dominios externos pueden fallar. |

---

## 2. Manejo de estados

### Situación actual
- **Auth**: dos sistemas en paralelo.
  - **AuthContext**: `localStorage` `auth` + `role`; solo lo usa **`/account`** (page.tsx).
  - **useAuthStore (Zustand)**: token en **cookie** `auth-token` + user; lo usan Login, NavBar, Profile, middleware y admin layout.
- **Cart**: Context + persistencia en `localStorage`; coherente.
- **Compare**: Context sin persistencia; se pierde al refrescar.

### Bugs críticos

1. **Token no llega a la API**
   - `lib/api.ts` → `getAuthToken()` lee **`localStorage.getItem("token")`**.
   - El login solo guarda el token en **cookie** (vía `useAuthStore`), nunca en `localStorage.token`.
   - **Efecto**: Cualquier llamada autenticada (ej. crear producto en admin) va **sin** `Authorization: Bearer ...` y falla con 401.

2. **Doble fuente de verdad en auth**
   - Login actualiza solo **Zustand** (y cookie).
   - `/account` (hub) usa **AuthContext** (`useAuth()`), que no se actualiza en el login.
   - **Efecto**: Usuario logueado con Zustand entra a `/account` y la página lo manda al login porque `isLoggedIn`/`role` del Context siguen en false/null.

3. **Redirect a ruta inexistente**
   - `LoginComponent.tsx` hace `router.push(isAdmin ? "/admin/dashboard" : "/account/profile")`.
   - La ruta real del dashboard es **`/admin`**, no `/admin/dashboard`.
   - **Efecto**: Admin que inicia sesión cae en 404.

### Recomendaciones
- **Unificar auth**: usar **solo** Zustand (y cookie) y leer el token desde cookie o desde el store en el cliente; que `fetchFromApi` use ese token (por ejemplo leyendo del store o de una cookie accesible en cliente). Eliminar o migrar AuthContext para que no haya dos fuentes de verdad.
- **Corregir redirect** de login: `"/admin/dashboard"` → `"/admin"`.
- **Opcional**: persistir compare en `localStorage` (como el carrito) si quieres que sobreviva al refresh.

---

## 3. Performance

### Lo que está bien
- **next/image** en NavBar, ProductCards, detalle de producto.
- **next/font** (Atkinson, Work Sans) en layout raíz.
- **Turbopack** en `next dev`.
- Uso de **Framer Motion** en la home (animaciones controladas).

### Problemas
| Problema | Dónde | Sugerencia |
|----------|--------|------------|
| **`<img>` en lugar de `next/image`** | Home: ASSET_PATHS (iphone, mic, tripode, etc.) | Usar `<Image>` con `sizes` para optimización y consistencia. |
| **Catálogo solo en cliente** | `products/page.tsx`: `useEffect` + `getProductos()` | Valorar **SSR** o **SSG** (o al menos fetch en server component) para primera carga y SEO. |
| **Sin cache de datos** | No hay React Query / SWR | Para listados y detalle, considerar **TanStack Query** o SWR (cache, revalidación, menos loading manual). |
| **CompareContext** | Cada ProductCard usa `useCompare()` y lee `compareList` | Si la lista crece, podría re-renderizar muchas cards; valorar selectores finos o memo. |

---

## 4. Escalabilidad

### Positivo
- **API** con `fetchFromApi` y servicios por dominio (ProductService, VariantesService, auth).
- **Tipos** compartidos (interfaces producto, auth) y re-export desde `api` donde aporta.

### A mejorar
- **Unificar admin**: un solo flujo “productos” (`/admin/products` o `/admin/productos`) con variantes, y deprecar el otro para no escalar dos CRUDs.
- **Filtros de catálogo**: `FilterSide` escribe `searchParams` (familia, modelo, estado, memoria) pero **products/page.tsx** no los usa; trae todos los productos y no filtra. Los filtros son solo decorativos. Para escalar con muchos productos, hace falta:
  - Backend: endpoint que acepte query params y filtre (o pagine).
  - Front: leer `searchParams` y pasarlos al fetch (o filtrar en cliente solo si la lista es pequeña y se acepta).
- **Rutas admin inexistentes**: Sidebar enlaza a `/admin/orders` y `/admin/users`; no existen esas páginas. Añadir rutas (aunque sea placeholder) o ocultar enlaces hasta tenerlas.

---

## 5. Buenas prácticas

### Lo que está bien
- **Zod** + **react-hook-form** en login/register.
- **Middleware** para rutas protegidas y rol Admin (cookie, JWT).
- **Admin layout** valida cookie y JWT en **servidor** antes de renderizar.
- **TypeScript** en modo estricto.
- **Componentes UI** (shadcn) con accesibilidad base.

### A corregir
- **Console.log** en middleware y en `lib/jwt.ts`: quitar o reemplazar por logger condicional (solo en dev).
- **Checkout**: formulario con validación manual; podría usar el mismo esquema Zod + react-hook-form que en auth.
- **Cart**: “Ir a pagar” usa `window.location.href = "/checkout"`; preferible `router.push("/checkout")` para SPA.
- **next.config**: corregir `remotePatterns` para ML (hostname y pathname) como se indicó arriba.

---

## 6. Qué tenés hoy en el proyecto

| Área | Estado |
|------|--------|
| **Landing** | Video, secciones, animaciones, FAQ, comunidad. |
| **Catálogo** | Listado desde API, filtros en UI (sin lógica), cards con compare. |
| **Detalle producto** | Variantes, galería, add to cart, toast. |
| **Carrito** | Context + localStorage, actualizar cantidad, vaciar, ir a pagar. |
| **Checkout** | Resumen, formulario de datos, botón “Continuar por WhatsApp” (sin integración real). |
| **Auth** | Login/register contra .NET, JWT en cookie, middleware + layout admin. |
| **Cuenta** | Hub `/account` (roto por AuthContext) y perfil `/account/profile` (ok con Zustand). |
| **Admin** | Dashboard, listado de productos (mock en `/admin/products`), crear producto, variantes en `/admin/productos`. Duplicidad products/productos. |
| **Compare** | Hasta 3 productos, barra de comparación; sin persistencia. |

---

## 7. Prioridades para cerrar el proyecto

### Crítico (rompe flujos)
1. **Unificar token en la API**: que `getAuthToken()` use el mismo token que el login (p. ej. leyendo desde Zustand o desde cookie en cliente). Si todo va por cookie, hacer que `fetchFromApi` tome el token de la cookie o del store; no de `localStorage.token` si nunca se escribe ahí.
2. **Unificar auth en el front**: que `/account` use **useAuthStore** (o eliminar AuthContext y que account lea solo del store). Así una sola fuente de verdad.
3. **Redirect post-login admin**: cambiar `"/admin/dashboard"` a `"/admin"` en `LoginComponent.tsx`.

### Alto (UX y consistencia)
4. **Filtros que filtren**: en `products/page.tsx` leer `searchParams` y o bien filtrar en cliente los resultados de `getProductos()` o bien pasar params al backend y tener un endpoint que filtre/pagine.
5. **Corregir next.config** para imágenes externas (Mercado Libre): hostname correcto y `pathname: "/**"`.
6. **Rutas admin**: crear `/admin/orders` y `/admin/users` (aunque sea “Próximamente”) o quitar enlaces del sidebar.

### Medio (calidad y mantenimiento)
7. **Un solo flujo de productos en admin**: elegir `products` o `productos`, migrar lo que haga falta y borrar el otro árbol de rutas.
8. **Quitar o condicionar console.log** en middleware y jwt.
9. **Checkout**: usar `router.push("/checkout")` en lugar de `window.location.href`; opcionalmente Zod + react-hook-form para el formulario.

### Bajo (mejoras)
10. **Landing**: reemplazar `<img>` por `<Image>` donde aplique.
11. **Catálogo**: valorar SSR/SSG o React Query para cache y mejor primera carga.
12. **Compare**: persistencia en localStorage si se quiere que sobreviva al refresh.

---

## Checklist rápido

- [ ] API: token leído desde cookie/store, no desde `localStorage.token`
- [ ] Una sola fuente de verdad para auth (Zustand); `/account` sin depender de AuthContext
- [ ] Login admin redirige a `/admin`
- [ ] Filtros de productos aplicados (backend o cliente)
- [ ] next.config: hostname y pathname correctos para imágenes
- [ ] Admin: una sola estructura de rutas de productos
- [ ] Rutas `/admin/orders` y `/admin/users` existentes o enlaces quitados
- [ ] Sin console.log en middleware/jwt en producción

Si querés, el siguiente paso puede ser implementar solo los 3 puntos críticos (token en API, unificar auth en cuenta, redirect admin) en el código concreto.
