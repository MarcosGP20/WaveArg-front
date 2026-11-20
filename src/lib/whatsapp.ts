// Número de WhatsApp de ventas (el del botón flotante). Footer y /contacto usan otro número:
// pendiente confirmar con el cliente cuál es el correcto.
const NUMERO_VENTAS = "5492262586880";

/** Link a WhatsApp de ventas con un mensaje ya escrito. */
export function linkWhatsApp(mensaje: string): string {
  return `https://wa.me/${NUMERO_VENTAS}?text=${encodeURIComponent(mensaje)}`;
}

/**
 * Link para escribirle por WhatsApp a un número que dejó un cliente (ej. un aviso de stock).
 * wa.me pide el número internacional sin "+": en Argentina, 549 + característica + número.
 * No saca el "15" de los celulares: sin saber el largo de la característica no se puede.
 */
export function linkWhatsAppA(numero: string): string {
  let digitos = numero.replace(/\D/g, "");
  if (digitos.startsWith("54")) {
    digitos = digitos.slice(2);
    if (digitos.startsWith("9")) digitos = digitos.slice(1);
  }
  digitos = digitos.replace(/^0/, "");
  return `https://wa.me/549${digitos}`;
}
