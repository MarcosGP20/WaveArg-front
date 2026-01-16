import { NextRequest, NextResponse } from "next/server";
import { decodeJWT } from "@/lib/jwt";

interface DecodedToken {
  id: string;
  email: string;
  rol: string;
  iat: number;
  exp: number;
}

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

function decodeToken(token: string): DecodedToken | null {
  try {
    return decodeJWT(token) as DecodedToken | null;
  } catch (error) {
    console.error("❌ Error decodificando token:", error);
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("auth-token")?.value;
  const isAuthenticated = token && !isTokenExpired(token);
  const decodedToken = isAuthenticated ? decodeToken(token!) : null;

  console.log(
    `🔐 [Middleware] ${pathname} | Auth: ${isAuthenticated} | Rol: ${
      decodedToken?.rol || "N/A"
    }`
  );

  // 1. Permitir rutas públicas
  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isPublic) {
    // Si está logueado e intenta login/register, redirigir
    if (
      isAuthenticated &&
      (pathname === "/login" || pathname === "/register")
    ) {
      console.log(
        `✅ [Redirect] Logueado intenta ${pathname} → /account/profile`
      );
      return NextResponse.redirect(new URL("/account/profile", request.url));
    }
    return NextResponse.next();
  }

  // 2. Proteger rutas que requieren autenticación
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected) {
    // Si no está autenticado
    if (!isAuthenticated) {
      console.log(`❌ [Redirect] No autenticado intenta ${pathname} → /login`);
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // 3. Validar acceso por rol
    if (pathname.startsWith("/admin")) {
      if (decodedToken?.rol !== "Admin") {
        console.log(`❌ [Redirect] No-Admin intenta /admin → /account/profile`);
        return NextResponse.redirect(new URL("/account/profile", request.url));
      }
      console.log(`✅ [Allow] Admin en /admin`);
    }

    if (pathname.startsWith("/account")) {
      console.log(`✅ [Allow] Usuario en /account`);
    }
  }

  return NextResponse.next();
}

// ⚠️ IMPORTANTE: El matcher debe ser simple y amplio
export const config = {
  matcher: [
    // Proteger TODAS las rutas
    // Excepto archivos estáticos y API
    "/((?!api|_next/static|_next/image|favicon|sitemap|robots).*)",
  ],
};
