interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataGridProps {
  columns: Column[];
  data: any[];
  title?: string;
}

export default function DataGrid({ columns, data, title }: DataGridProps) {
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
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
