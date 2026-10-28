// Número de WhatsApp de ventas (el del botón flotante). Footer y /contacto usan otro número:
// pendiente confirmar con el cliente cuál es el correcto.
const NUMERO_VENTAS = "5492262586880";

/** Link a WhatsApp de ventas con un mensaje ya escrito. */
export function linkWhatsApp(mensaje: string): string {
  return `https://wa.me/${NUMERO_VENTAS}?text=${encodeURIComponent(mensaje)}`;
}
