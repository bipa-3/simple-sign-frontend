import React, { useState, useEffect } from 'react';
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

  const [selectionModel, setSelectionModel] = useState([]); // 첫 번째 요소를 선택

  useEffect(() => {
    handleSelectionModelChange(rows[0]?.id);
  }, [rows]);

  const handleSelectionModelChange = (newSelection) => {
    setSelectionModel(newSelection);
  };

  return (
    <div style={{ height: '100%', width: '100%', overflow: 'auto' }}>
      <DataGrid
        autoWidth
        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={handleSelectionModelChange}
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
