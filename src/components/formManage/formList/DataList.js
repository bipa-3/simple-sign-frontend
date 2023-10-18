import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

export default function DataList({ columns, rows, dataHandler }) {
  let columnsWithFlex = columns.map((column) => ({
    ...column,
    headerAlign: 'center',
  }));

  if (columns.length === 1) {
    columnsWithFlex = columnsWithFlex.map((column) => ({
      ...column,
      flex: 1,
    }));
  }

  return (
    <div style={{ height: '100%', width: '100%', overflow: 'auto' }}>
      <DataGrid
        autoWidth
        rows={rows}
        columns={columnsWithFlex}
        hideFooter
        onRowClick={(event) => {
          dataHandler(event.row);
        }}
      />
    </div>
  );
}
