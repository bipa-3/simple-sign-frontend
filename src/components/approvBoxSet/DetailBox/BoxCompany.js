import React, { useState } from 'react';
import styled from '../../../styles/pages/ApprovalBoxSetPage.module.css';
import Datalist from '../Datalist';
import { useApprovalBoxManage } from '../../../contexts/ApprovalBoxManageContext';

function BoxCompany(props) {
  const { approvalBoxState, setApprovalBoxState } = useApprovalBoxManage();
  const [selectedCompany, setSelectedCompany] = useState(
    approvalBoxState.selectedCompany
  );

  const handleCompanyChange = (newValue) => {
    setSelectedCompany(newValue);
    setApprovalBoxState({ ...approvalBoxState, compId: newValue });
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
        />
      </div>
    </div>
  );
}

export default BoxCompany;
