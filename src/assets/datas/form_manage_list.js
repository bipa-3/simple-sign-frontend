import React from 'react';

export const columns = [
  {
    field: 'id',
    headerName: '코드',
    width: 70,
    sortable: false,
  },
  { field: 'compName', headerName: '회사', width: 150, sortable: false },
  { field: 'formName', headerName: '양식명', width: 150, sortable: false },
  {
    field: 'status',
    headerName: '사용여부',
    width: 70,
    sortable: false,
    renderCell: (params) => (
      <span>{params.value === 1 ? '사용' : '미사용'}</span>
    ),
  },
];
