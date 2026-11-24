// Datos del vendedor que una tienda online argentina tiene que mostrar (footer y páginas legales).
// Los que están en null son PENDIENTES del cliente: en el sitio se ven como "[pendiente]" hasta que
// Wave los pase. No inventar ninguno.
export const VENDEDOR = {
  nombre: "Wave Arg",
  razonSocial: null as string | null,
  cuit: null as string | null,
  domicilioLegal: null as string | null,
  localidades: "Necochea y Mar del Plata, Buenos Aires",
  email: "contacto@wavearg.com",
  horario: "Lunes a viernes de 9 a 18 hs, sábados de 10 a 13 hs",
};

/** Cómo se ve en el sitio un dato que todavía falta. */
export const PENDIENTE = "[pendiente]";
