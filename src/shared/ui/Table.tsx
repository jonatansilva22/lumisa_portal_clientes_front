import { type ReactNode } from "react";

type Column<T> = {
  header: ReactNode;
  accessor: keyof T | ((row: T) => ReactNode);
  className?: string;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  className?: string;
};

export function Table<T extends object>({ columns, data, className = "" }: TableProps<T>) {
  return (
    <div className={`overflow-x-auto rounded-xl shadow bg-white ${className}`}>
      <table className="min-w-full w-full border-separate border-spacing-0">
        <thead>
          <tr className="bg-blue-100">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`px-4 py-3 text-left font-semibold text-gray-700 ${col.className || ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-gray-100">
              {columns.map((col, cIdx) => (
                <td
                  key={cIdx}
                  className={`px-4 py-2 align-middle border-b border-gray-300 ${col.className || ""}`}
                >
                  {typeof col.accessor === "function"
                    ? col.accessor(row)
                    : (row as any)[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}