import React from 'react';
import ApprovalBoxList from '../../components/approvBoxSet/ApprovalBoxList';
import styled from '../../styles/pages/ApprovalBoxSetPage.module.css';
import Button from '../../components/common/Button';
import InnerBox from '../common/InnerBox';
import Datalist from './Datalist';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { useApprovalBox } from '../../contexts/ApprovalBoxContext';
import { useApprovalBoxManage } from '../../contexts/ApprovalBoxManageContext';

function ViewApprovalBoxList() {
  const [selectedCompanyId, setSelectedCompanyId] = useState(0);
  const {
    state,
    setState,
    setInitDataState,
    initData,
    setApprovalBoxState,
    approvalBoxInit,
  } = useApprovalBoxManage();

  const handleAddButtonClick = () => {
    setState((prevState) => ({
      ...prevState,
      boxId: undefined,
      insertStatus: 1,
    }));
    setInitDataState((prevState) => ({
      initData,
    }));
    setApprovalBoxState((prevState) => ({
      approvalBoxInit,
    }));
  };

  return (
    <InnerBox
      height="100%"
      width="45%"
      font_size="15px"
      text="결재함 목록"
      childStyle={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        marginBottom: '30px',
      }}
      titleChildren={
        <Button
          label={'추가'}
          btnStyle={'red_btn'}
          onClick={handleAddButtonClick}
          width="65px"
          height="30px"
          fontSize="12px"
        />
      }
    >
      <div className={styled.searchbox}>
        <div className={styled.selectContainer}>
          {' '}
          <Datalist onCompanyChange={setSelectedCompanyId} />
        </div>

        <div className={styled.inputSearch}>
          <input type="text" placeholder="결재함명을 입력하세요" />
          <Button
            label={<SearchIcon style={{ fontSize: '15px' }} />}
            btnStyle={'dark_btn'}
            width="32px"
            height="32px"
            fontSize="12px"
          />
        </div>
      </div>
      <div className={styled.boxlist}>
        <ApprovalBoxList companyId={selectedCompanyId} />
      </div>
    </InnerBox>
  );
}
export default ViewApprovalBoxList;
