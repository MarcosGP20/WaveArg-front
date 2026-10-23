// Verifica el JWT de la cookie auth-token del lado servidor (middleware y layout de admin), con
// la misma clave que lo firma el back (Jwt__Key → JWT_SECRET). Usa Web Crypto, disponible en el
// runtime del middleware y en Node, sin dependencias.
//
// Un token adulterado, firmado con otra clave, vencido o de otro tipo (ej. el de reset de
// contraseña) es lo mismo que no tener sesión.

export interface Sesion {
  id: string;
  email: string;
  rol: string;
  exp: number;
}

// Iguales a Jwt:Issuer y Jwt:Audience del back (appsettings.json).
const ISSUER = process.env.JWT_ISSUER ?? "WaveArg";
const AUDIENCE = process.env.JWT_AUDIENCE ?? "WaveArgFrontend";

function base64UrlABytes(valor: string): Uint8Array<ArrayBuffer> {
  const b64 = valor.replace(/-/g, "+").replace(/_/g, "/");
  const binario = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
  return Uint8Array.from(binario, (c) => c.charCodeAt(0));
}

function leerJson(parte: string): Record<string, unknown> | null {
  try {
    const valor = JSON.parse(new TextDecoder().decode(base64UrlABytes(parte)));
    return typeof valor === "object" && valor !== null ? valor : null;
  } catch {
    return null;
  }
}

export async function verificarSesion(token: string | undefined): Promise<Sesion | null> {
  const secreto = process.env.JWT_SECRET;
  if (!token || !secreto) return null;

  const partes = token.split(".");
  if (partes.length !== 3) return null;
  const [headerB64, payloadB64, firmaB64] = partes;

  const header = leerJson(headerB64);
  if (header?.alg !== "HS256") return null;

  let firmaValida = false;
  try {
    const clave = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secreto),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    firmaValida = await crypto.subtle.verify(
      "HMAC",
      clave,
      base64UrlABytes(firmaB64),
      new TextEncoder().encode(`${headerB64}.${payloadB64}`),
    );
  } catch {
    return null;
  }
  if (!firmaValida) return null;

  const p = leerJson(payloadB64);
  if (!p) return null;
  const ahora = Math.floor(Date.now() / 1000);
  const audiencias = Array.isArray(p.aud) ? p.aud : [p.aud];
  if (typeof p.exp !== "number" || p.exp < ahora) return null;
  if (p.iss !== ISSUER || !audiencias.includes(AUDIENCE)) return null;
  if (typeof p.id !== "string" || typeof p.rol !== "string") return null;

  return { id: p.id, email: typeof p.email === "string" ? p.email : "", rol: p.rol, exp: p.exp };
}

export function esAdmin(sesion: Sesion | null): boolean {
  const rol = sesion?.rol.toLowerCase();
  return rol === "admin" || rol === "administrador";
}
