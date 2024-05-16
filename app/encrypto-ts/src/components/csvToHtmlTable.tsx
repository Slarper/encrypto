import React, { FC } from "react";
import { parseCsvToRowsAndColumn } from "../utils";

interface CsvToHtmlTableProps {
  data?: string;
  csvDelimiter?: string;
  hasHeader?: boolean;
  tableClassName?: string;
  tableRowClassName?: string;
  tableColumnClassName?: string;
  rowKey?: (row: string[], rowIdx: number) => string;
  colKey?: (col: string, colIdx: number, rowIdx: number) => string;
  renderCell?: (column: string, colIdx: number, rowIdx: number) => JSX.Element;
}

const CsvToHtmlTable: FC<CsvToHtmlTableProps> = ({
  data = '',
  csvDelimiter = '\t',
  hasHeader = true,
  tableClassName = '',
  tableRowClassName = '',
  tableColumnClassName = '',
  rowKey = (row, rowIdx) => `row-${rowIdx}`,
  colKey = (col, colIdx, rowIdx) => `col-${colIdx}`,
  renderCell
}) => {
  const rowsWithColumns = parseCsvToRowsAndColumn(data.trim(), csvDelimiter);
  let headerRow: string[] | undefined;
  if (hasHeader) {
    headerRow = rowsWithColumns.splice(0, 1)[0];
  }

  const renderTableHeader = (row: string[] | undefined) => {
    if (row && row.map) {
      return (
        <thead>
          <tr>
            {
              row.map((column, i) => (
                <th
                  key={`header-${i}`}
                >
                  {column}
                </th>
              ))
            }
          </tr>
        </thead>
      );
    }
  };

  const renderTableBody = (rows: string[][]) => {
    if (rows && rows.map) {
      return (
        <tbody>
          {
            rows.map((row, rowIdx) => (
              <tr className={tableRowClassName} key={rowKey(row, rowIdx)}>
                {
                  row.map && row.map((column, colIdx) => (
                    <td
                      className={tableColumnClassName}
                      key={colKey(column, colIdx, rowIdx)}
                    >
                      {typeof renderCell === "function" ? renderCell(column, colIdx, rowIdx) : column}
                    </td>
                  ))
                }
              </tr>
            ))
          }
        </tbody>
      );
    }
  };

  return (
    <table className={`csv-html-table ${tableClassName}`}>
      {renderTableHeader(headerRow)}
      {renderTableBody(rowsWithColumns)}
    </table>
  );
};

export default CsvToHtmlTable;
