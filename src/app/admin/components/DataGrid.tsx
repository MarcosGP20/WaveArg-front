import { encabezadoTabla, filaTabla, panel, td, th } from "./estilos";

// Una columna por campo de la fila: render recibe el valor de ese campo con su tipo.
export type Column<T> = {
  [K in keyof T & string]: {
    key: K;
    label: string;
    align?: "left" | "right";
    render?: (value: T[K], row: T) => React.ReactNode;
  };
}[keyof T & string];

interface DataGridProps<T> {
  columns: Column<T>[];
  data: T[];
  title?: string;
  emptyMessage?: string;
}

function celda<T>(col: Column<T>, row: T): React.ReactNode {
  const valor = row[col.key];
  const render = col.render as ((value: T[keyof T], row: T) => React.ReactNode) | undefined;
  return render ? render(valor, row) : (valor as React.ReactNode);
}

export default function DataGrid<T>({
  columns,
  data,
  title,
  emptyMessage = "No hay datos para mostrar.",
}: DataGridProps<T>) {
  return (
    <div className={panel}>
      {title && (
        <div className="px-6 py-4">
          <h2 className="text-lg font-semibold text-tinta">{title}</h2>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto" aria-label={title}>
          <thead>
            <tr className={encabezadoTabla}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`${th} ${col.align === "right" ? "text-right" : ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm text-tinta">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center text-tinta-suave">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={filaTabla}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`${td} ${col.align === "right" ? "text-right tabular-nums" : ""}`}
                    >
                      {celda(col, row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
