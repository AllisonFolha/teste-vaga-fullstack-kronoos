import React from 'react';
import './Table.scss';

interface TableProps {
  columns: string[];
  data: any[];
}

const Table: React.FC<TableProps> = ({ columns, data }) => (
    <table className="table">
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column, colIndex) => (
              <td key={colIndex}>{row[column]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

export default Table;
