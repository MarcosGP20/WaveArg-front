const DOMINIOS_MERCADOPAGO = ["mercadopago.com", "mercadopago.com.ar"];

/** El checkout solo redirige a https en un dominio de MercadoPago (o subdominio). */
export function esUrlDePagoValida(url: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  if (parsed.protocol !== "https:" || parsed.username || parsed.password) return false;
  const host = parsed.hostname.toLowerCase();
  return DOMINIOS_MERCADOPAGO.some((d) => host === d || host.endsWith(`.${d}`));
}
