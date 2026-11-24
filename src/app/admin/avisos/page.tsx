"use client";

import { BellRing } from "lucide-react";
import { LeadsService, type LeadAdmin } from "@/lib/api";
import { linkWhatsAppA } from "@/lib/whatsapp";
import { ListadoAdmin } from "../components/ListadoAdmin";
import { td } from "../components/estilos";

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

const cargarAvisos = () => LeadsService.getAll();

// Avisos de stock que dejan en el formulario de la home (POST /Leads): a quién escribirle cuando
// entra el modelo que busca.
export default function AvisosPage() {
  return (
    <ListadoAdmin<LeadAdmin>
      titulo="Avisos de stock"
      cargar={cargarAvisos}
      contar={(n) => `${n} ${n === 1 ? "contacto" : "contactos"}`}
      etiquetaActualizar="Actualizar avisos"
      vacio={{ icono: <BellRing size={40} strokeWidth={1.75} />, mensaje: "Todavía nadie pidió un aviso de stock." }}
      columnas={["Email", "Busca", "WhatsApp", "Fecha"]}
      celdas={(aviso) => (
        <>
          <td className={td}>
            <a href={`mailto:${aviso.email}`} className="underline underline-offset-4">
              {aviso.email}
            </a>
          </td>
          <td className={td}>{aviso.modelo ?? "—"}</td>
          <td className={`${td} text-tinta-suave`}>
            {aviso.whatsapp ? (
              <a href={linkWhatsAppA(aviso.whatsapp)} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                {aviso.whatsapp}
              </a>
            ) : (
              "—"
            )}
          </td>
          <td className={`${td} whitespace-nowrap text-tinta-suave`}>{formatFecha(aviso.creadoEn)}</td>
        </>
      )}
    />
  );
}
