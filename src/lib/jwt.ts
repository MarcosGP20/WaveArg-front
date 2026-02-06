/**
 * Decodifica un JWT sin validar la firma (solo para extraer claims)
 * NOTA: Esto es seguro porque el JWT ya fue validado por el backend
 */
export function decodeJWT(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("JWT inválido");

    // Base64URL → Base64 + padding
    const payloadB64Url = parts[1];
    const payloadB64 = payloadB64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded =
      payloadB64 + "=".repeat((4 - (payloadB64.length % 4)) % 4);

    let json = "";
    // Edge runtime (middleware) NO tiene window/Buffer siempre, pero sí suele tener atob en globalThis
    const atobFn =
      typeof globalThis !== "undefined" && typeof globalThis.atob === "function"
        ? globalThis.atob
        : null;

    if (atobFn) {
      json = atobFn(padded);
    } else if (typeof Buffer !== "undefined") {
      // Node.js environment
      json = Buffer.from(padded, "base64").toString("utf8");
    } else {
      throw new Error("No hay decoder Base64 disponible");
    }
    const payload = JSON.parse(json);
    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Extrae el ID del usuario del JWT
 */
export function getUserIdFromJWT(token: string): string | null {
  const payload = decodeJWT(token);
  // El claim puede ser "nameid", "sub", "id", etc. dependiendo del backend
  return payload?.nameid || payload?.sub || payload?.id || null;
}

/**
 * Extrae el email del JWT
 */
export function getEmailFromJWT(token: string): string | null {
  const payload = decodeJWT(token);
  return payload?.email || null;
}

/**
 * Extrae el rol del JWT
 */
export function getRoleFromJWT(token: string): string | null {
  const payload = decodeJWT(token);
  // El claim puede ser "role", "roles", "rol", etc.
  const rol = payload?.role || payload?.roles || payload?.rol || null;
  return rol;
}
