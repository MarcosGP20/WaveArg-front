"use client";

import { Undo2 } from "lucide-react";
import { ArrepentimientosService, type ArrepentimientoAdmin } from "@/lib/api";
import { ListadoAdmin } from "../components/ListadoAdmin";
import { td } from "../components/estilos";

function formatFecha(iso: string) {
  return new Date(iso).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const cargarSolicitudes = () => ArrepentimientosService.getAll();

// Solicitudes del botón de arrepentimiento (POST /Arrepentimientos). Cada una llega también por
// mail (Alertas__EmailAdmin); acá quedan aunque el mail no haya salido.
export default function ArrepentimientosPage() {
  return (
    <ListadoAdmin<ArrepentimientoAdmin>
      titulo="Arrepentimientos"
      cargar={cargarSolicitudes}
      contar={(n) => `${n} ${n === 1 ? "solicitud" : "solicitudes"}`}
      etiquetaActualizar="Actualizar solicitudes"
      vacio={{ icono: <Undo2 size={40} strokeWidth={1.75} />, mensaje: "No hay solicitudes de arrepentimiento." }}
      columnas={["Código", "Cliente", "Pedido", "Detalle", "Fecha"]}
      celdas={(s) => (
        <>
          <td className={`${td} font-mono`}>{s.codigo}</td>
          <td className={td}>
            <p className="font-medium">{s.nombre}</p>
            <a href={`mailto:${s.email}?subject=${encodeURIComponent(`Tu arrepentimiento ${s.codigo}`)}`} className="text-xs text-tinta-suave underline underline-offset-4">
              {s.email}
            </a>
          </td>
          <td className={`${td} font-mono text-tinta-suave`}>{s.numeroPedido ?? "—"}</td>
          <td className={`${td} max-w-xs text-tinta-suave`}>{s.detalle ?? "—"}</td>
          <td className={`${td} whitespace-nowrap text-tinta-suave`}>{formatFecha(s.creadoEn)}</td>
        </>
      )}
    />
  );
}
