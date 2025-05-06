import React from "react";

export interface ReusableTableProps<T> {
  columns: { header: string; accessor: keyof T }[];
  data: T[];
  className?: string;
  renderRow?: (row: T) => React.ReactNode;
}

export function Table<T>({ columns, data, className = "", renderRow }: ReusableTableProps<T>) {
  return (
    <table className={`min-w-full border ${className}`}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.accessor as string} className="px-4 py-2 border-b text-left">{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) =>
          renderRow ? (
            <React.Fragment key={idx}>{renderRow(row)}</React.Fragment>
          ) : (
            <tr key={idx}>
              {columns.map((col) => (
                <td key={col.accessor as string} className="px-4 py-2 border-b">
                  {String(row[col.accessor])}
                </td>
              ))}
            </tr>
          )
        )}
      </tbody>
    </table>
  );
}
