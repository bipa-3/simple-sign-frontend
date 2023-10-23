import React from 'react';
import styled from '../../../styles/pages/ApprovalBoxSetPage.module.css';
import { useApprovalBoxManage } from '../../../contexts/ApprovalBoxManageContext';
import { useState } from 'react';
import { useEffect } from 'react';

function BoxName(props) {
  const [localBoxName, setLocalBoxName] = useState('');
  const { approvalBoxState, setApprovalBoxState } = useApprovalBoxManage();

  useEffect(() => {
    setLocalBoxName(props.boxName); // props로 전달받은 boxName을 로컬 상태에 설정
  }, [props.boxName]);

  const handleLocalInputChange = (e) => {
    const updatedName = e.target.value;
    setLocalBoxName(updatedName);
    setApprovalBoxState((prevState) => ({
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
            value={localBoxName || ''}
            className={styled.inputstyle}
            onChange={handleLocalInputChange}
          />
        </div>
      </div>
    </div>
  );
}
export default BoxName;
