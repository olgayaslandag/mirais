import type { SpecTable as SpecTableData } from "@/lib/catalog";

/**
 * Teknik özellik tablosu: erişilebilir `table` (scope="col"),
 * mobilde yatay kaydırma sarmalayıcısı ile.
 */
export default function SpecTable({
  specs,
  caption,
}: {
  specs: SpecTableData;
  caption?: string;
}) {
  if (!specs?.columns?.length) return null;
  return (
    <div className="table-responsive">
      <table className="spec-table">
        {caption ? <caption>{caption}</caption> : null}
        <thead>
          <tr>
            {specs.columns.map((column, index) => (
              <th key={`${column}-${index}`} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {specs.rows.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <td key={`cell-${rowIndex}-${cellIndex}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
