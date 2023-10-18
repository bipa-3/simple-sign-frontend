import React from 'react';
import styled from '../../../styles/components/ApprovalBox/ViewDocBox.module.css';
import { useApprovalBox } from '../../../contexts/ApprovalBoxContext';
import { useLocation } from 'react-router-dom';

function TableHeader() {
  const { state, setState } = useApprovalBox();

  const location = useLocation(); // URL의 위치 정보를 얻음
  const queryParams = new URLSearchParams(location.search);
  const viewItemsString = queryParams.get('viewItems');
  const viewItems = viewItemsString ? viewItemsString.split(',') : [];

  const setDatename = () => {
    if (viewItems.includes('send') || viewItems.includes('reference')) {
      return '기안일';
    } else if (viewItems.includes('tempor')) {
      return '작성일';
    } else if (viewItems.includes('pend')) {
      return '도착일';
    } else if (viewItems.includes('concluded')) {
      return '결재일';
    }
  };

  return (
    <div className={styled.tableheader}>
      <div className={styled.titleAndcontents}>
        <span className={styled.title1}>{setDatename()}</span>
        <span className={styled.title2}>제목/문서번호</span>
        <span className={styled.title3}>기안자/기안부서</span>
        <span className={styled.title4}>
          {viewItems !== 'tempor' && '결재상태'} {/* 변경된 부분: !== 사용 */}
        </span>
      </div>
    </div>
  );
}
export default TableHeader;
