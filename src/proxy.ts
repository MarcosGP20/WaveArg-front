import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth-cookie";
import { esAdmin, verificarSesion } from "@/lib/sesion";

// Rutas públicas (sin protección)
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/products",
  "/creadores",
  "/nosotros",
  "/contacto",
  "/mayorista",
  "/compare",
];

// Rutas que requieren autenticación
const PROTECTED_ROUTES = ["/account", "/admin", "/cart", "/checkout"];

const isDev = process.env.NODE_ENV === "development";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  // Firma, vencimiento, issuer y audience: un token adulterado es lo mismo que no tener sesión.
  const decodedToken = await verificarSesion(token);
  const isAuthenticated = decodedToken !== null;

  if (isDev) {
    console.log(
      `🔐 [Middleware] ${pathname} | Auth: ${isAuthenticated} | Rol: ${
        decodedToken?.rol || "N/A"
      } | Token existe: ${!!token}`,
    );
  }

  if (!token && pathname.startsWith("/admin")) {
    if (isDev) console.log("⚠️ [Warning] No hay token en cookie para ruta /admin");
  }

  // 1. Permitir rutas públicas
  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  if (isPublic) {
    // Si está logueado e intenta login/register, redirigir
    if (
      isAuthenticated &&
      (pathname === "/login" || pathname === "/register")
    ) {
      if (isDev) {
        console.log(
          `✅ [Redirect] Logueado intenta ${pathname} → /account/profile`,
        );
      }
      return NextResponse.redirect(new URL("/account/profile", request.url));
    }
    return NextResponse.next();
  }

  // 2. Proteger rutas que requieren autenticación
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtected) {
    // Si no está autenticado
    if (!isAuthenticated) {
      if (isDev) console.log(`❌ [Redirect] No autenticado intenta ${pathname} → /login`);
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // 3. Validar acceso por rol
    if (pathname.startsWith("/admin")) {
      if (!esAdmin(decodedToken)) {
        if (isDev) {
          console.log(
            `❌ [Redirect] No-Admin (rol: ${decodedToken?.rol}) intenta /admin → /account/profile`,
          );
        }
        return NextResponse.redirect(new URL("/account/profile", request.url));
      }
      if (isDev) console.log(`✅ [Allow] Admin en /admin (rol: ${decodedToken?.rol})`);
    }

    if (pathname.startsWith("/account")) {
      if (isDev) console.log(`✅ [Allow] Usuario en /account`);
    }
  }

  return NextResponse.next();
}

// ⚠️ IMPORTANTE: El matcher debe ser simple y amplio
export const config = {
  matcher: [
    // Proteger TODAS las rutas
    // Excepto archivos estáticos y API
    // y archivos de /public (videos, imágenes): no necesitan verificar la sesión
    "/((?!api|_next/static|_next/image|favicon|sitemap|robots|.*\\.(?:svg|png|jpe?g|webp|avif|gif|ico|mp4|webm|woff2?)$).*)",
  ],
};
