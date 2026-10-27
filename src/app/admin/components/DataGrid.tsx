// Una columna por campo de la fila: render recibe el valor de ese campo con su tipo.
export type Column<T> = {
  [K in keyof T & string]: {
    key: K;
    label: string;
    render?: (value: T[K], row: T) => React.ReactNode;
  };
}[keyof T & string];

interface DataGridProps<T> {
  columns: Column<T>[];
  data: T[];
  title?: string;
}

function celda<T>(col: Column<T>, row: T): React.ReactNode {
  const valor = row[col.key];
  const render = col.render as ((value: T[keyof T], row: T) => React.ReactNode) | undefined;
  return render ? render(valor, row) : (valor as React.ReactNode);
}

export default function DataGrid<T>({ columns, data, title }: DataGridProps<T>) {
  return (
    <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
      {title && (
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
      )}
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            {columns.map((col) => (
              <th key={col.key} className="py-3 px-6 text-left">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              {columns.map((col) => (
                <td key={col.key} className="py-3 px-6 text-left">
                  {celda(col, row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
