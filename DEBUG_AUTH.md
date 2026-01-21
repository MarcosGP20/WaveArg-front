# 🔍 Debug de Autenticación - /admin/productos

## ⚠️ Problema Reportado
No puedes acceder a `/admin/productos` aunque estés logueado como Admin.

## ✅ Cambios Realizados

### 1. `src/lib/jwt.ts`
- ✅ Añadido log para ver exactamente qué rol se extrae del JWT

### 2. `middleware.ts`
- ✅ Validación de rol ahora es **case-insensitive** 
- ✅ Acepta "admin" o "administrador" (no solo "Admin")
- ✅ Mejorados los logs para debug

## 🔧 Pasos para Diagnosticar

### Opción 1: Verificar en el Navegador (F12 - DevTools)

1. **Abre DevTools** (F12)
2. Pestaña **Network** → Filtra por "cookies" o la URL del admin
3. Pestaña **Application** → Storage → Cookies → Busca `auth-token`
4. **Console** → Busca logs que digan:
   - `🔐 [Middleware]` - muestra qué rol detectó
   - `🔑 Rol extraído del JWT` - muestra el rol extraído
   - `❌ [Redirect]` - si te redirige

### Opción 2: Reproducir el Login
1. Logout (Ctrl+Shift+Delete borrar cookies si es necesario)
2. Login nuevamente como Admin
3. Intenta acceder a `/admin/productos`
4. **Revisa los logs del navegador** en Console

## 📋 Checklist de Verificación

- [ ] ¿La cookie `auth-token` existe después de login?
- [ ] ¿El rol en el token es "Admin" (con mayúscula)?
- [ ] ¿El token tiene fecha de expiración futura?
- [ ] ¿El middleware muestra "✅ [Allow] Admin en /admin"?

## 🚀 Si Sigue Sin Funcionar

Si después de estos cambios **sigue sin funcionar**, necesito que:

1. **Vayas a DevTools** (F12)
2. **Console** → Haz login
3. **Copia y pega todos los logs amarillos/azules**
4. **Trata de acceder a `/admin/productos`**
5. **Copia todos los logs nuevamente**

Esto me ayudará a ver qué rol realmente está enviando tu backend.
