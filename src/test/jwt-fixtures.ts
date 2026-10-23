// Arma JWTs con los mismos claims que emite el backend (TokenService): id, email, rol.
// fakeJwt/tokenDe tienen firma falsa: sirven para lo que sólo decodifica (lib/jwt.ts). Para lo
// que verifica la firma (middleware) está tokenFirmado.
export function fakeJwt(payload: Record<string, unknown>): string {
  const b64url = (value: object) =>
    Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
  return `${b64url({ alg: "HS256", typ: "JWT" })}.${b64url(payload)}.firma-falsa`;
}

export function tokenDe(rol: string, opciones: { expiraEnSegundos?: number; email?: string } = {}): string {
  const ahora = Math.floor(Date.now() / 1000);
  return fakeJwt({
    id: "42",
    email: opciones.email ?? "cliente@wave.local",
    rol,
    exp: ahora + (opciones.expiraEnSegundos ?? 3600),
  });
}

// Clave con la que los tests firman tokens "del back". Los tests del middleware la ponen en
// JWT_SECRET, igual que en Vercel va la Jwt__Key del back.
export const SECRETO_TEST = "clave-de-prueba-de-al-menos-32-bytes!!";

// Token firmado en HS256 como lo emite el back, con issuer y audience.
export async function tokenFirmado(
  rol: string,
  opciones: { expiraEnSegundos?: number; secreto?: string; issuer?: string } = {},
): Promise<string> {
  const b64url = (bytes: Uint8Array) => Buffer.from(bytes).toString("base64url");
  const json = (value: object) => b64url(new TextEncoder().encode(JSON.stringify(value)));
  const ahora = Math.floor(Date.now() / 1000);
  const firmado = `${json({ alg: "HS256", typ: "JWT" })}.${json({
    id: "42",
    email: "cliente@wave.local",
    rol,
    exp: ahora + (opciones.expiraEnSegundos ?? 3600),
    iss: opciones.issuer ?? "WaveArg",
    aud: "WaveArgFrontend",
  })}`;
  const clave = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(opciones.secreto ?? SECRETO_TEST),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const firma = await crypto.subtle.sign("HMAC", clave, new TextEncoder().encode(firmado));
  return `${firmado}.${b64url(new Uint8Array(firma))}`;
}
