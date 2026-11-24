// Avisos de stock de la home: quien no compra hoy deja su contacto.
import { fetchFromApi } from "@/lib/api";
import { linkWhatsApp } from "@/lib/whatsapp";
import type { LeadFormValues } from "@/schemas/lead.schema";

/**
 * Con NEXT_PUBLIC_LEADS_API=true el formulario guarda el contacto con POST /Leads sin sacar a la
 * persona de la página. Sin la variable (back sin ese endpoint deployado), el pedido de aviso sale
 * por WhatsApp con el mensaje ya escrito, que es como llegan las consultas.
 */
export const LEADS_POR_API = process.env.NEXT_PUBLIC_LEADS_API === "true";

/** Lo que se le manda al back. */
export interface LeadDTO {
  email: string;
  modelo: string | null;
  whatsapp: string | null;
  origen: "home";
}

export function leadDesdeFormulario(valores: LeadFormValues): LeadDTO {
  return {
    email: valores.email,
    modelo: valores.modelo || null,
    whatsapp: valores.whatsapp || null,
    origen: "home",
  };
}

export function registrarLead(lead: LeadDTO) {
  return fetchFromApi<{ message?: string }>("/Leads", {
    method: "POST",
    body: JSON.stringify(lead),
  });
}

/** El mismo pedido, escrito para mandarlo por WhatsApp. */
export function mensajeDeAviso(lead: LeadDTO): string {
  return [
    "Hola, quiero que me avisen cuando entren iPhones.",
    lead.modelo ? `Busco: ${lead.modelo}` : null,
    `Mi mail: ${lead.email}`,
  ]
    .filter((linea) => linea !== null)
    .join("\n");
}

export function linkAvisoWhatsApp(lead: LeadDTO): string {
  return linkWhatsApp(mensajeDeAviso(lead));
}
