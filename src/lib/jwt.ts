/**
 * Decodifica un JWT sin validar la firma (solo para extraer claims)
 * NOTA: Esto es seguro porque el JWT ya fue validado por el backend
 */
export function decodeJWT(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("JWT inválido");

    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.error("Error decodificando JWT:", error);
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
  return payload?.role || payload?.roles || payload?.rol || null;
}
