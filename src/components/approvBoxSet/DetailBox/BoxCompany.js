import React, { useState } from 'react';
import styled from '../../../styles/pages/ApprovalBoxSetPage.module.css';
import Datalist from '../Datalist';
import { useApprovalBoxManage } from '../../../contexts/ApprovalBoxManageContext';

function BoxCompany(props) {
  const { approvalBoxState, setApprovalBoxState, setApprovalBoxState2, state } =
    useApprovalBoxManage();
  const [selectedCompany, setSelectedCompany] = useState(
    approvalBoxState.selectedCompany
  );

  const handleCompanyChange = (newValue) => {
    setSelectedCompany(newValue);
    setApprovalBoxState((prevState) => ({ ...prevState, compId: newValue }));
    setApprovalBoxState2((prevState) => ({ ...prevState, compId: newValue }));
  };

  return (
    <div className={styled.inputItem}>
      <div style={props.commonCellStyle}>
        <div className={styled.text}>회사</div>
      </div>
      <div style={props.commonDataStyle}>
        <Datalist
          selectedCompId={props.compId}
          onCompanyChange={handleCompanyChange}
          readonly={props.boxId ? true : false}
          insertState={state.insertStatus}
        />
      </div>
    </div>
  );
}

export default BoxCompany;
