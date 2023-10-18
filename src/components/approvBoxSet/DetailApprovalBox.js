import React, { useState } from 'react';
import Button from '../../components/common/Button';
import InnerBox from '../common/InnerBox';
import DetailBox from './DetailBox';
import { useApprovalBoxManage } from '../../contexts/ApprovalBoxManageContext';
import updateApprovalBox from '../../apis/approvalBoxAPI/updateApprovalBox';
import insertApprovalBox from '../../apis/approvalBoxAPI/insertApprovalBox';

function DetailApprovalBox() {
  const { state, setState, approvalBoxState } = useApprovalBoxManage();

  const handleSaveClick = async () => {
    try {
      if (state.insertStatus === 1) {
        const response = await insertApprovalBox(approvalBoxState);
      } else if (state.insertStatus === 0) {
        const response = await updateApprovalBox(approvalBoxState);
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }

    setState((prevState) => ({
      ...prevState,
      insertStatus: 0,
    }));
  };

  return (
    <InnerBox
      height="100%"
      width="55%"
      font_size="15px"
      text="결재함 상세"
      childStyle={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      titleChildren={
        <Button
          label={'저장'}
          btnStyle={'green_btn'}
          onClick={handleSaveClick}
          width="65px"
          height="30px"
          fontSize="12px"
        />
      }
    >
      <DetailBox boxId={state.boxId} />
    </InnerBox>
  );
}

export default DetailApprovalBox;
