import { AlertCircle, RefreshCw } from "lucide-react";
import { botonPrimario, panel, subtituloPagina, tituloPagina } from "./estilos";

// Cabecera de cada pantalla del admin: título, línea de contexto y acciones a la derecha.
export function CabeceraPagina({
  titulo,
  subtitulo,
  children,
}: {
  titulo: string;
  subtitulo?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className={tituloPagina}>{titulo}</h1>
        {subtitulo && <p className={subtituloPagina}>{subtitulo}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

// Carga: filas con la forma de la tabla, no un spinner.
export function TablaSkeleton({ filas = 8 }: { filas?: number }) {
  return (
    <div className={`${panel} animate-pulse`} role="status" aria-label="Cargando">
      <div className="h-11 bg-borde/60" />
      {Array.from({ length: filas }).map((_, i) => (
        <div key={i} className="h-14 border-t border-borde" />
      ))}
    </div>
  );
}

// Sin resultados: dice qué pasa y, si hay acción, cuál es el próximo paso.
export function EstadoVacio({
  icono,
  mensaje,
  children,
}: {
  icono: React.ReactNode;
  mensaje: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`${panel} flex flex-col items-center justify-center gap-3 px-6 py-16 text-center`}>
      <div className="text-tinta-suave">{icono}</div>
      <p className="text-sm text-tinta-suave">{mensaje}</p>
      {children}
    </div>
  );
}

// Error de carga: qué falló y un botón para reintentar.
export function EstadoError({
  mensaje,
  onReintentar,
}: {
  mensaje: string;
  onReintentar: () => void;
}) {
  return (
    <div
      role="alert"
      className={`${panel} flex flex-col items-center justify-center gap-3 px-6 py-16 text-center`}
    >
      <AlertCircle size={36} strokeWidth={1.75} className="text-destructive" />
      <p className="max-w-sm text-sm font-medium text-tinta">{mensaje}</p>
      <button onClick={onReintentar} className={botonPrimario}>
        <RefreshCw size={16} strokeWidth={1.75} />
        Reintentar
      </button>
    </div>
  );
}
