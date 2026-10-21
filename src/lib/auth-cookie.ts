// Cookie de sesión: la setea /api/auth/session (httpOnly) y la leen el middleware,
// el layout de /admin y el proxy /api/backend. Una sola definición para que no se desalineen.
export const AUTH_COOKIE_NAME = "auth-token";

export function authCookieOptions(maxAge: number) {
  return {
    name: AUTH_COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge,
  };
}
