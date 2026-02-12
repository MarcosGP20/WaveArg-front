# Estado del proyecto — Wave ARG E-commerce

**Última actualización:** Feb 2025

---

## Estado actual (qué está listo)

### Autenticación y sesión
- **Auth unificado en Zustand**: una sola fuente de verdad (store + cookie `auth-token`).
- **API** usa el token de la cookie en todas las llamadas; en 401 se hace logout automático.
- **Middleware** protege rutas (`/account`, `/admin`, `/cart`, `/checkout`) y valida rol Admin.
- **Login/Register**: si ya estás logueado, redirige a `/account/profile` (guard en página + middleware).
- **Admin**: login de admin redirige a `/admin` (ruta correcta).

### Tienda pública
- **Landing**: video, secciones, animaciones, FAQ, comunidad.
- **Catálogo**: listado desde API .NET, **filtros reales** (estado, memoria, modelo, familia) sobre el array traído con `getProductos()`.
- **Detalle producto**: variantes, galería, agregar al carrito, toast.
- **Carrito**: Context + `localStorage`, actualizar cantidad, vaciar.
- **Checkout**: resumen, formulario de datos, botón “Continuar por WhatsApp” (sin integración real de pago).

### Cuenta y admin
- **Cuenta**: hub `/account` y perfil `/account/profile` con Zustand; admins redirigen a `/admin`.
- **Admin**: dashboard, listado de productos (`/admin/products`), crear producto, variantes (`/admin/productos`). Layout valida cookie y rol en servidor.

### Otros
- **Comparador**: hasta 3 productos, barra de comparación (sin persistencia al refrescar).
- **TypeScript** estricto, **Zod** + **react-hook-form** en auth, **next/image** en catálogo y detalle.

---

## Qué falta para largar a producción

### Prioridad alta (evitar errores y mala UX)

| Tarea | Dónde | Qué hacer |
|-------|--------|-----------|
| **Rutas admin 404** | Sidebar enlaza a `/admin/orders` y `/admin/users` | Crear `admin/orders/page.tsx` y `admin/users/page.tsx` con mensaje “Próximamente” o quitar esos ítems del sidebar hasta tener la funcionalidad. |
| **next.config imágenes** | `next.config.ts` | Corregir bloque de Mercado Libre: `hostname` correcto (ej. `http2.mlstatic.com` o el que uses) y agregar `pathname: "/**"`. |
| **Checkout desde carrito** | `cart/page.tsx` | Cambiar `window.location.href = "/checkout"` por `router.push("/checkout")` para navegación SPA. |

### Prioridad media (limpieza y consistencia)

| Tarea | Dónde | Qué hacer |
|-------|--------|-----------|
| **Console.log en producción** | `middleware.ts`, `LoginComponent.tsx`, componentes admin | Quitar o envolver en `if (process.env.NODE_ENV === "development")`. |
| **Un solo flujo de productos en admin** | `admin/products/*` y `admin/productos/*` | Elegir uno (ej. `admin/products`), migrar lo necesario y eliminar el otro árbol de rutas. |

### Prioridad baja (mejoras opcionales)

| Tarea | Notas |
|-------|--------|
| **Landing** | Reemplazar `<img>` por `<Image>` donde aplique (optimización). |
| **Catálogo** | Valorar SSR o React Query para mejor primera carga y cache. |
| **Compare** | Persistir en `localStorage` si querés que sobreviva al refresh. |
| **Checkout** | Formulario con Zod + react-hook-form; integrar flujo real de pago/WhatsApp. |

---

## Checklist pre-producción

- [ ] Variables de entorno: `NEXT_PUBLIC_API_BASE` apuntando al backend de producción.
- [ ] Rutas `/admin/orders` y `/admin/users` existentes o enlaces quitados del sidebar.
- [ ] next.config: `remotePatterns` correctos para todas las imágenes externas.
- [ ] Carrito: “Ir a pagar” con `router.push("/checkout")`.
- [ ] Sin `console.log` (o solo en dev) en middleware y componentes sensibles.
- [ ] Probar flujo completo: registro, login, catálogo con filtros, carrito, checkout, cuenta, admin (crear producto).
- [ ] Probar en móvil y distintos navegadores.

---

## Resumen

El proyecto está en buen estado para un **MVP**: auth, catálogo con filtros, carrito, checkout básico y admin funcionando. Para largar a producción conviene cerrar los ítems de **prioridad alta** (rutas admin, next.config, navegación del carrito) y, si da el tiempo, los de **prioridad media** (logs y un solo flujo de productos en admin).
