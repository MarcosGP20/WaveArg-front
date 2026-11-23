# Backlog

Pendientes que quedaron fuera de la rama que los encontró. Cada uno va como issue aparte.

## NavBar desincronizada con la cookie de sesión

- **Dónde:** `src/components/NavBar.tsx` y `src/components/Footer.tsx` (`isLoggedIn` y `user` de `useAuthStore`).
- **Problema:** la NavBar muestra "logueado" según localStorage, no según la cookie `auth-token`. Si la cookie vence (el JWT dura 2 h) o se borra, sigue mostrando el menú de usuario hasta que se pasa por `/login` o hasta que un request al back responde 401. Al revés, si el navegador perdió localStorage pero la cookie sigue válida, muestra "Iniciar sesión" a alguien que tiene sesión.
- **Contexto:** desde `fix-account-sesion`, `/account` (`account/layout.tsx` + `SesionCuenta`) y `/login` ya alinean el store con la cookie. La NavBar no, porque se renderiza en todas las páginas, incluidas las públicas, que no verifican la sesión en el servidor.
- **Fuera de alcance de `fix-account-sesion`** por decisión del 2026-11-06.

## `GET /api/Usuarios/me` en el back

- **Dónde:** back `WaveArg/Controllers/UsuariosController.cs` (hoy solo tiene `GET` de admin y `PUT /{id}`). En el front, `account/SesionCuenta.tsx` y el perfil.
- **Problema:** el JWT no trae el nombre y no hay endpoint para pedirlo. El perfil muestra el nombre guardado en localStorage solo si es del mismo id que la sesión. Si se borró localStorage o la sesión es de otro usuario, muestra la parte local del email hasta que el usuario edita su nombre.
- **Propuesta:** `GET /api/Usuarios/me` con `[Authorize]`, que devuelva `{ id, email, nombre, rol }` del usuario del token. El front lo pide en `SesionCuenta` y actualiza el store. Toca los dos repos: el PR del back va primero.
- **Fuera de alcance de `fix-account-sesion`** por decisión del 2026-11-06.

## Parciales del sync de `facts.db` (2026-11-22)

Hallazgos de la auditoría que el sync del 2026-11-22 encontró resueltos en parte, verificados contra `revalidar-rol@b7172fc`. Los números son ids de `facts.db` (carpeta `Wave/docs/audit-vault`), no issues de GitHub. Siguen `open` hasta que se cierre lo que falta. Los que tocan back o los dos repos están en el `docs/backlog.md` del back.

### Seguridad y proxy

- **#26 [medium] Proxy `/api/backend` sin límites en escrituras.** El timeout de 30 s corre solo en GET y HEAD (decisión comentada en `route.ts:21-22`). POST y PUT siguen sin timeout, `req.arrayBuffer()` (`route.ts:60`) no tiene límite de tamaño y la ruta no fija `maxDuration`.

### Código

- **#11 [low] Componentes grandes.** `ProductDetailContent` (626 líneas), `compare/page` (576), `lib/api.ts` (590) y `NavBar` (430). `products/[id]/page.tsx:10` y `accesorios/[id]/page.tsx:14` siguen con `fetch` directo: llevarlos a `lib/`.

### Multimedia (en stand-by)

- **#89 [medium] `<img>` sin optimizar.** Quedan 14 `<img>` crudos (ficha de accesorio, comparador, `CompareBar`, `CartAbandonmentReminder` y 4 en admin) y varios `unoptimized`. Toca multimedia: no se hace hasta que decida el cliente.
