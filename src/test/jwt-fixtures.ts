// Arma JWTs con los mismos claims que emite el backend (TokenService): id, email, rol.
// La firma es falsa: el front solo decodifica, la valida el backend.
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
