import React, { useState, useEffect } from 'react';
import DataList from '../common/DataList';
import styled from '../../styles/components/org/OrgTopGrid.module.css';
import { getGridView } from '../../apis/orgAPI/getGridView';

const deptcolumns = [
  { field: 'company', headerName: '회사', width: 150, sortable: false },
  { field: 'establishment', headerName: '사업장', width: 150, sortable: false },
  { field: 'department', headerName: '부서', width: 150, sortable: false },
];

const usercolumns = [
  {
    field: 'company',
    headerName: '회사',
    width: 150,
    sortable: true,
  },
  {
    field: 'establishment',
    headerName: '사업장',
    width: 150,
    sortable: true,
  },
  {
    field: 'department',
    headerName: '부서',
    width: 150,
    sortable: true,
  },
  { field: 'position', headerName: '직급', width: 150, sortable: true },
  { field: 'grade', headerName: '직책', width: 150, sortable: true },
  { field: 'user', headerName: '사용자', width: 150, sortable: true },
];

export default function OrgTopGrid({
  selectedNode,
  onRowSelect,
  view,
  isChecked,
  search,
  setSearch,
  setSelectedNode,
}) {
  const [gridRows, setGridRows] = useState([]);

  const handleData = (row) => {
    if (onRowSelect) {
      onRowSelect(row);
    }
  };

  const gridDataMap = (item, index, view) => {
    const baseData = {
      id: index + 1,
      company: item.compName || '',
      establishment: item.estName || '',
      department: item.deptName || '',
      compId: item.compId,
      deptId: item.deptId,
      estId: item.estId,
    };
    if (view === 'user' || view === 'approvalUser') {
      return {
        ...baseData,
        position: item.positionName || '',
        grade: item.gradeName || '',
        user: item.userName || '',
        userId: item.orgUserId,
      };
    }
    return baseData;
  };

  useEffect(() => {
    if (selectedNode) {
      setSearch('');

      if (selectedNode) {
        getGridView(selectedNode, view, isChecked)
          .then((response) => {
            console.log(response);
            const api = response.data;

            const mappedData = api.map((item, index) => {
              return gridDataMap(item, index, view);
            });
            setGridRows(mappedData);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  }, [selectedNode, isChecked]);

  useEffect(() => {
    if (search) {
      setSelectedNode(null);

      if (search) {
        if (search && search.length === 0) {
          alert('검색된 결과가 없습니다.');
          setGridRows([]);
        } else if (search && search.length > 0) {
          const api = search;

          const mappedData = api.map((item, index) => {
            return gridDataMap(item, index, view);
          });
          setGridRows(mappedData);
        }
      }
    }
  }, [search]);

  return (
    <div className={styled.datalist}>
      <DataList
        columns={view === 'dept' ? deptcolumns : usercolumns}
        rows={gridRows}
        dataHandler={handleData}
      />
    </div>
  );
}
