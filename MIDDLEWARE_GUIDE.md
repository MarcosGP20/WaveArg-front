#!/usr/bin/env node
/**
 * 🔐 GUÍA: Sistema de Middleware de Autenticación en Next.js 15
 * 
 * Este documento explica cómo funciona el middleware de autenticación
 * y cómo está configurado para proteger rutas basadas en roles.
 */

// ============================================
// 1. ARQUITECTURA: localStorage → Cookie → Middleware
// ============================================

/**
 * FLUJO DE AUTENTICACIÓN:
 * 
 * 1️⃣ El usuario se loguea en /login
 * 2️⃣ El backend devuelve un JWT
 * 3️⃣ useAuthStore.setAuth() guarda:
 *    - localStorage (para persistencia de estado en React)
 *    - Cookie (para que el middleware lo lea en el servidor)
 * 4️⃣ El middleware intercepta TODAS las peticiones
 * 5️⃣ Lee la cookie "auth-token" del servidor
 * 6️⃣ Decodifica el JWT y valida rol/expiration
 * 7️⃣ Permite o redirige según permisos
 * 
 * ⚠️ POR QUÉ NO USAR SOLO localStorage:
 * - localStorage solo existe en el navegador (client-side)
 * - El middleware corre en el servidor (server-side)
 * - Las cookies viajan con TODAS las requests HTTP
 * - El servidor puede leerlas automáticamente
 */

// ============================================
// 2. ARCHIVOS PRINCIPALES
// ============================================

/**
 * 📄 middleware.ts (raíz del proyecto)
 * - Intercepta todas las requests
 * - Lee cookie "auth-token"
 * - Decodifica JWT
 * - Valida roles (Admin, User)
 * - Redirige según permisos
 * 
 * 🔑 Funciones clave:
 * - decodeToken(): Decodifica JWT y extrae claims
 * - isTokenExpired(): Verifica si expiró
 * - isProtectedRoute(): Detecta rutas protegidas
 * - isAdminRoute(): Detecta rutas solo Admin
 * - isUserRoute(): Detecta rutas solo User
 */

/**
 * 📄 src/store/useAuthStore.ts
 * - Store Zustand con persistencia
 * - setAuth(): Guarda token en localStorage Y cookie
 * - logout(): Elimina token de localStorage Y cookie
 * 
 * ⚠️ IMPORTANTE:
 * if (typeof document !== "undefined") {
 *   // Solo ejecutar en cliente, no en servidor
 *   document.cookie = ...
 * }
 */

/**
 * 📄 src/lib/jwt.ts
 * - decodeJWT(): Decodifica JWT sin validación de firma
 * - getUserIdFromJWT(): Extrae ID del usuario
 * - getEmailFromJWT(): Extrae email
 * - getRoleFromJWT(): Extrae rol
 */

/**
 * 📄 src/components/LoginComponent.tsx
 * - Llama a loginUser() del backend
 * - Extrae datos del JWT
 * - Llama a setAuth() que guarda en cookie
 * - Redirige según rol
 */

// ============================================
// 3. FLUJOS DE REDIRECCIONAMIENTO
// ============================================

/**
 * 🟢 USUARIO NO AUTENTICADO:
 * 
 * /login           → ✅ Permitido (public)
 * /register        → ✅ Permitido (public)
 * /                → ✅ Permitido (public)
 * /products        → ✅ Permitido (public)
 * 
 * /account/*       → ❌ Redirige a /login
 * /admin/*         → ❌ Redirige a /login
 */

/**
 * 🟡 USUARIO AUTENTICADO (ROL: "User"):
 * 
 * /login           → ❌ Redirige a /account/profile
 * /register        → ❌ Redirige a /account/profile
 * /                → ✅ Permitido
 * /products        → ✅ Permitido
 * 
 * /account/*       → ✅ Permitido
 * /admin/*         → ❌ Redirige a /account/profile
 */

/**
 * 🔴 USUARIO AUTENTICADO (ROL: "Admin"):
 * 
 * /login           → ❌ Redirige a /account/profile
 * /register        → ❌ Redirige a /account/profile
 * /                → ✅ Permitido
 * /products        → ✅ Permitido
 * 
 * /account/*       → ✅ Permitido (Admin puede acceder)
 * /admin/*         → ✅ Permitido
 */

// ============================================
// 4. CONFIGURACIÓN DE COOKIES
// ============================================

/**
 * Cookie guardada:
 * auth-token=eyJhbGc...; path=/; max-age=604800; SameSite=Strict
 * 
 * ⏰ max-age=604800 = 7 días en segundos
 * 🛡️ SameSite=Strict = Protege contra CSRF
 * 📍 path=/ = Disponible en todo el dominio
 */

// ============================================
// 5. CONFIGURACIÓN DEL MATCHER
// ============================================

/**
 * El middleware NO se ejecuta en:
 * - /api/*                    (rutas API)
 * - /_next/static/*           (archivos compilados)
 * - /_next/image/*            (imágenes optimizadas)
 * - /favicon.ico              (icono)
 * - /sitemap.xml              (SEO)
 * - /robots.txt               (SEO)
 * - /*.svg, *.png, *.jpg, etc (archivos estáticos)
 */

// ============================================
// 6. VALIDACIÓN DE TOKEN EN MIDDLEWARE
// ============================================

/**
 * Cada request:
 * 1. Lee cookie "auth-token"
 * 2. Si no existe → isAuthenticated = false
 * 3. Si existe:
 *    a. Decodifica con jwt-decode
 *    b. Verifica expiración (exp claim)
 *    c. Si expiró → isAuthenticated = false
 *    d. Si válido → isAuthenticated = true
 * 4. Obtiene rol del token decodificado
 * 5. Valida permisos según ruta
 */

// ============================================
// 7. DEBUGGING
// ============================================

/**
 * El middleware imprime logs como:
 * 
 * 🔐 [Middleware] /admin/dashboard | Auth: true | Rol: Admin
 * ✅ [Allow] Admin accediendo a /admin/dashboard
 * 
 * 🔐 [Middleware] /account/profile | Auth: true | Rol: User
 * ✅ [Allow] User accediendo a /account/profile
 * 
 * 🔐 [Middleware] /login | Auth: true | Rol: User
 * ✅ [Redirect] Usuario autenticado intenta acceder a /login → /account/profile
 * 
 * 🔐 [Middleware] /admin/dashboard | Auth: true | Rol: User
 * ❌ [Redirect] Usuario no-admin intenta acceder a /admin/dashboard → /account/profile
 */

// ============================================
// 8. TESTING
// ============================================

/**
 * 1️⃣ Sin autenticación:
 *    - Abre incógnita
 *    - Ve a http://localhost:3001/admin
 *    - ✅ Debe redirigir a /login
 * 
 * 2️⃣ Como usuario normal:
 *    - Loguéate con rol "User"
 *    - Intenta ir a /admin
 *    - ✅ Debe redirigir a /account/profile
 * 
 * 3️⃣ Como admin:
 *    - Loguéate con rol "Admin"
 *    - Ve a /admin
 *    - ✅ Debe permitir acceso
 * 
 * 4️⃣ Logueado intenta login:
 *    - Estando en /account/profile
 *    - Ve a /login directamente
 *    - ✅ Debe redirigir a /account/profile
 */

export {};
