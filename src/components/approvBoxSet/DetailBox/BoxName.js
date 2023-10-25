import React from 'react';
import styled from '../../../styles/pages/ApprovalBoxSetPage.module.css';
import { useApprovalBoxManage } from '../../../contexts/ApprovalBoxManageContext';
import { useState, useEffect } from 'react';

function BoxName(props) {
  const { approvalBoxState, setApprovalBoxState, setApprovalBoxState2, state } =
    useApprovalBoxManage();

  // 초기 상태를 props.boxName으로 설정
  const [localBoxName, setLocalBoxName] = useState(props.boxName || '');

  useEffect(() => {
    if (state.count !== 0) {
      setLocalBoxName('');
    }
  }, [state.count]);

  useEffect(() => {
    setLocalBoxName(props.boxName || '');
  }, [props.boxName]);

  const handleLocalInputChange = (e) => {
    const updatedName = e.target.value;
    setLocalBoxName(updatedName);
    setApprovalBoxState((prevState) => ({
      ...prevState,
      approvalBoxName: updatedName,
    }));
    setApprovalBoxState2((prevState) => ({
      ...prevState,
      approvalBoxName: updatedName,
    }));
    props.handleInputChange && props.handleInputChange(e);
  };

  return (
    <div className={styled.inputItem}>
      <div style={props.commonCellStyle}>
        <div className={styled.text}>
          <span className={styled.notnull}>*</span>명칭
        </div>
      </div>
      <div style={props.commonDataStyle}>
        <div>
          <input
            type="text"
            value={localBoxName}
            className={styled.inputstyle}
            onChange={handleLocalInputChange}
          />
        </div>
      </div>
    </div>
  );
}

export default BoxName;
