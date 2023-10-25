import React, { useEffect, useState } from 'react';
import Button from '../../components/common/Button';
import InnerBox from '../common/InnerBox';
import DetailBox from './DetailBox';
import { useApprovalBoxManage } from '../../contexts/ApprovalBoxManageContext';
import updateApprovalBox from '../../apis/approvalBoxAPI/updateApprovalBox';
import insertApprovalBox from '../../apis/approvalBoxAPI/insertApprovalBox';
import { checkBoxCreateData } from '../../validation/ApprovalBoxManage/ApprovalBoxSetSchema';
import { useLoading } from '../../contexts/LoadingContext';
import { checkBoxUseDeptData } from '../../validation/ApprovalBoxManage/boxUseDeptSchema';

function DetailApprovalBox() {
  const { state, setState, approvalBoxState, approvalBoxState2 } =
    useApprovalBoxManage();
  const { showLoading, hideLoading } = useLoading();
  const handleSaveClick = async () => {
    try {
      if (state.insertStatus === 1) {
        await checkBoxCreateData(approvalBoxState); // 유효성 검사
        if (approvalBoxState.menuUsingRange === 'P') {
          await checkBoxUseDeptData(approvalBoxState);
        }
        showLoading();
        const response = await insertApprovalBox(approvalBoxState); // API 호출

        // 요청이 성공하면 상태 업데이트
        setState((prevState) => ({
          ...prevState,
          insertStatus: 0,
        }));
        hideLoading();
      } else if (
        state.insertStatus === 0 &&
        approvalBoxState.approvalBoxId != null
      ) {
        await checkBoxCreateData(approvalBoxState2); // 유효성 검사
        if (approvalBoxState.menuUsingRange === 'P') {
          await checkBoxUseDeptData(approvalBoxState2);
        }
        showLoading();

        const response = await updateApprovalBox(approvalBoxState2); // API 호출

        hideLoading();
      }
    } catch (error) {
      // 유효성 검증 오류나 API 호출 오류 모두 이곳에서 처리됩니다.
      console.error('Error saving data:', error);
      alert(
        error.message ||
          '데이터를 저장하는 도중 에러가 발생했습니다. 다시 시도해 주세요.'
      );
    }
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
