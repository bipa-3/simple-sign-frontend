import React, { useEffect, useState } from 'react';
import styled from '../../styles/pages/ApprovalBoxSetPage.module.css';
import getBoxDetail from '../../apis/approvalBoxAPI/getBoxDetail';
import ViewItem from './DetailBox/ViewItem';
import BoxCompany from './DetailBox/BoxCompany';
import BoxName from './DetailBox/BoxName';
import BoxUseStatus from './DetailBox/BoxUseStatus';
import MenuUseRange from './DetailBox/MenuUseRange';
import { useApprovalBoxManage } from '../../contexts/ApprovalBoxManageContext';
import SortOrder from './DetailBox/SortOrder';
import { useLoading } from '../../contexts/LoadingContext';

const commonCellStyle = {
  width: '30%',
  backgroundColor: '#f3f5f6',
  padding: '13.6px 0 13.6px 13.6px',
};

const commonDataStyle = {
  width: '70%',
  color: '#6c757d',
  padding: '13.6px',
};

function DetailBox() {
  const { state, setState, setApprovalBoxState, setApprovalBoxState2 } =
    useApprovalBoxManage();
  let boxId = state.boxId;
  const [menuOption, setMenuOption] = useState('T');
  const [useStatus, setUseStatus] = useState(1);
  const [data, setData] = useState([]);
  const { showLoading, hideLoading } = useLoading();
  const [selectedCompany, setSelectedCompany] = useState(null);

  const handleUseStatusChange = (event) => {
    setUseStatus(event.target.value);
  };

  const handleInputChange = (e) => {};

  const handleCompanyChange = (company) => {
    setSelectedCompany(company);
  };

  useEffect(() => {
    // setState((prevState) => ({
    //   ...prevState,
    //   boxId: prevState.boxList[0],
    // }));
    if (boxId) {
      boxId = state.boxList[0].approvalBoxId;
    }
  }, []);

  useEffect(() => {
    if (isNaN(boxId)) {
      setUseStatus('사용');
      setMenuOption('T');
    }
  }, [boxId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const parsedBoxId = parseInt(boxId, 10);
        // boxId 값이 없거나, 유효한 숫자가 아니면 API 호출을 스킵
        if (isNaN(parsedBoxId)) {
          setData([]);
          return;
        }
        showLoading();
        const response = await getBoxDetail(parsedBoxId);
        setData(response.data);

        if (response.data.length > 0) {
          const boxDetail = response.data[0];

          setUseStatus(
            boxDetail.approvalBoxUsedStatus === 1 ? '사용' : '미사용'
          );
          setMenuOption(boxDetail.menuUsingRange);

          // Update the approvalBoxState with the fetched data
          setApprovalBoxState2((prevState) => ({
            ...prevState,
            approvalBoxId: boxDetail.approvalBoxId,
            compId: boxDetail.compId,
            approvalBoxName: boxDetail.approvalBoxName,
            approvalBoxUsedStatus: boxDetail.approvalBoxUsedStatus,
            menuUsingRange: boxDetail.menuUsingRange,
            sortOrder: boxDetail.sortOrder,
          }));
          hideLoading();
        }
      } catch (error) {
        console.error('Error fetching box details:', error);
      }
    };

    fetchData();
  }, [state.boxId]);

  useEffect(() => {
    setUseStatus('사용');
    setMenuOption('T');
  }, [state.count]);

  if (isNaN(boxId)) {
    return (
      <div className={styled.formcontainer}>
        <BoxCompany
          commonCellStyle={commonCellStyle}
          commonDataStyle={commonDataStyle}
          onCompanyChange={handleCompanyChange}
        />
        <BoxName
          commonCellStyle={commonCellStyle}
          commonDataStyle={commonDataStyle}
        />
        <ViewItem
          commonCellStyle={commonCellStyle}
          commonDataStyle={commonDataStyle}
        />
        <BoxUseStatus
          commonCellStyle={commonCellStyle}
          commonDataStyle={commonDataStyle}
          handleUseStatusChange={handleUseStatusChange}
          useStatus={useStatus}
        />
        <MenuUseRange
          commonCellStyle={commonCellStyle}
          commonDataStyle={commonDataStyle}
          menuOption={menuOption}
          setMenuOption={setMenuOption}
          selectedCompany={selectedCompany}
        />
        <SortOrder
          commonCellStyle={commonCellStyle}
          commonDataStyle={commonDataStyle}
        />
      </div>
    );
  }

  return (
    <div className={styled.formcontainer}>
      {data.map((boxDetail, index) => (
        <React.Fragment key={index}>
          <BoxCompany
            commonCellStyle={commonCellStyle}
            commonDataStyle={commonDataStyle}
            compId={boxDetail.compId}
            onCompanyChange={handleCompanyChange}
          />
          <BoxName
            commonCellStyle={commonCellStyle}
            commonDataStyle={commonDataStyle}
            handleInputChange={handleInputChange}
            boxName={boxDetail.approvalBoxName}
          />
          <ViewItem
            commonCellStyle={commonCellStyle}
            commonDataStyle={commonDataStyle}
            boxId={boxId}
          />
          <BoxUseStatus
            commonCellStyle={commonCellStyle}
            commonDataStyle={commonDataStyle}
            useStatus={useStatus}
            handleUseStatusChange={handleUseStatusChange}
          />
          <MenuUseRange
            commonCellStyle={commonCellStyle}
            commonDataStyle={commonDataStyle}
            menuOption={menuOption}
            setMenuOption={setMenuOption}
            boxId={boxId}
            selectedCompany={selectedCompany}
          />
          <SortOrder
            commonCellStyle={commonCellStyle}
            commonDataStyle={commonDataStyle}
            handleInputChange={handleInputChange}
            sortOrder={boxDetail.sortOrder}
            boxId={boxId}
          />
        </React.Fragment>
      ))}
    </div>
  );
}

export default DetailBox;
