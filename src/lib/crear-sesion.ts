// Guarda el token del login en la cookie httpOnly auth-token (POST /api/auth/session, que lo
// verifica antes de setearla). Es el único uso del token en el navegador: no pasa por el store.
export async function crearSesion(token: string): Promise<void> {
  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    throw new Error("No se pudo iniciar la sesion.");
  }
}
