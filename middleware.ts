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

const isDev = process.env.NODE_ENV === "development";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("auth-token")?.value;
  const isAuthenticated = token && !isTokenExpired(token);
  const decodedToken = isAuthenticated ? decodeToken(token!) : null;

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
      // Verificar múltiples variantes del rol (case-insensitive)
      const userRol = decodedToken?.rol?.toLowerCase() || "";
      const isAdmin = userRol === "admin" || userRol === "administrador";

      if (!isAdmin) {
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
    "/((?!api|_next/static|_next/image|favicon|sitemap|robots).*)",
  ],
};
