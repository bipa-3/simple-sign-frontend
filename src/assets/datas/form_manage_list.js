import React from 'react';

export const columns = [
  { field: 'compName', headerName: '회사', width: 150 },
  { field: 'formName', headerName: '양식명', width: 150 },
  {
    field: 'status',
    headerName: '사용여부',
    width: 70,
    renderCell: (params) => (
      <span>{params.value === 1 ? '사용' : '미사용'}</span>
    ),
  },
];
