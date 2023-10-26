import React, { useState, useEffect } from 'react';
import DataList from '../formManage/formList/DataList';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import styled from '../../styles/components/org/OrgBottomGrid.module.css';

export default function OrgBottomGrid({ selectedRow, view, remove }) {
  const deptcolumns = [
    { field: 'company', headerName: '회사', width: 150, sortable: false },
    {
      field: 'establishment',
      headerName: '사업장',
      width: 150,
      sortable: false,
    },
    { field: 'department', headerName: '부서', width: 150, sortable: false },
    {
      field: 'delete',
      headerName: '삭제',
      width: 70,
      renderCell: (params) => (
        <IconButton onClick={() => remove(params.row.id)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const usercolumns = [
    { field: 'company', headerName: '회사', width: 150, sortable: false },
    {
      field: 'establishment',
      headerName: '사업장',
      width: 150,
      sortable: false,
    },
    { field: 'department', headerName: '부서', width: 150, sortable: false },
    { field: 'position', headerName: '직급', width: 150, sortable: false },
    { field: 'grade', headerName: '직책', width: 150, sortable: false },
    { field: 'user', headerName: '사용자', width: 150, sortable: false },
    {
      field: 'delete',
      headerName: '삭제',
      width: 70,
      sortable: false,
      renderCell: (params) => (
        <IconButton onClick={() => remove(params.row.id)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const handleData = (row) => {
    console.log(row);
  };

  return (
    <div className={styled.bottom_datalist}>
      <DataList
        columns={view === 'dept' ? deptcolumns : usercolumns}
        rows={selectedRow}
        dataHandler={handleData}
      />
    </div>
  );
}
