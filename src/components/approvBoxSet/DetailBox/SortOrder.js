import React, { useState, useEffect } from 'react';
import styled from '../../../styles/pages/ApprovalBoxSetPage.module.css';
import { useApprovalBoxManage } from '../../../contexts/ApprovalBoxManageContext';

function SortOrder(props) {
  const [localSortOrder, setLocalSortOrder] = useState(props.sortOrder || '');
  const { approvalBoxState, setApprovalBoxState2, setApprovalBoxState, state } =
    useApprovalBoxManage();
  useEffect(() => {
    if (state.count !== 0) {
      setLocalSortOrder('');
    }
  }, [state.count]);

  useEffect(() => {
    props.sortOrder
      ? setLocalSortOrder(props.sortOrder)
      : setLocalSortOrder('');
  }, [props.boxId, props.sortOrder]);

  const handleLocalInputChange = (e) => {
    const updatedOrder = e.target.value;

    // 숫자만 입력되도록 유효성 검사
    if (/^[0-9]*$/.test(updatedOrder)) {
      setLocalSortOrder(updatedOrder);
      setApprovalBoxState((prevState) => ({
        ...prevState,
        sortOrder: updatedOrder,
      }));
      setApprovalBoxState2((prevState) => ({
        ...prevState,
        sortOrder: updatedOrder,
      }));
      props.handleInputChange && props.handleInputChange(e);
    }
  };

  return (
    <div className={styled.inputItem}>
      <div style={props.commonCellStyle}>
        <div className={styled.text}>정렬순서</div>
      </div>
      <div style={props.commonDataStyle}>
        <div>
          <input
            type="text"
            value={localSortOrder}
            className={styled.inputstyle}
            onChange={handleLocalInputChange}
          />
        </div>
      </div>
    </div>
  );
}

export default SortOrder;
