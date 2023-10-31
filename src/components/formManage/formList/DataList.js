import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useSeqManage } from '../../../contexts/SeqManageContext';

export default function DataList({
  columns,
  rows,
  dataHandler,
  isCheckTable = false,
  initData = [],
}) {
  const [selectionModel, setSelectionModel] = useState([]); // 첫 번째 요소를 선택
  const [selectionCheckModel, setSelectionCheckModel] = useState(initData); // 첫 번째 요소를 선택
  const { detailData } = useSeqManage();
  useEffect(() => {
    handleSelectionModelChange(rows[0]?.id);
  }, [rows]);

  const handleSelectionModelChange = (newSelection) => {
    setSelectionModel(newSelection);
  };

  //일반 리스트
  const dataGridListOption = {
    rowSelectionModel: selectionModel,
    onRowSelectionModelChange: handleSelectionModelChange,
    onRowClick: (event) => {
      dataHandler(event.row);
    },
  };

  //체크박스 리스트
  const dataGridCheckBoxOption = {
    checkboxSelection: true,
    onRowSelectionModelChange: (newRowSelectionModel) => {
      let data = rows.filter((ele) => {
        return newRowSelectionModel.includes(ele.id);
      });
      dataHandler(data);
      setSelectionCheckModel(newRowSelectionModel);
    },
    rowSelectionModel: selectionCheckModel,
  };

  useEffect(() => {
    if (initData !== undefined) {
      let result = initData.map((ele) => {
        return ele.useId.toString();
      });
      setSelectionCheckModel(result);
    }
    console.log('selected:', selectionCheckModel);
  }, [detailData]);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <DataGrid
        autoWidth
        rows={rows}
        columns={columns}
        hideFooter
        disableColumnMenu={true}
        {...(isCheckTable
          ? { ...dataGridCheckBoxOption }
          : { ...dataGridListOption })}
      />
    </div>
  );
}
