import React from 'react';
import styled from '../../../styles/pages/ApprovalBoxSetPage.module.css';
import PopUp from '../../common/PopUp';
import Radiobtn from '../Radiobtn';
import { useState } from 'react';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import { useApprovalBoxManage } from '../../../contexts/ApprovalBoxManageContext';
import { useEffect } from 'react';
import OrgChart from '../../org/OrgChart';
import getBoxUseDept from '../../../apis/approvalBoxAPI/getBoxUseDept';
import AreaBox from './AreaBox';

function MenuUseRange(props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    approvalBoxState,
    setApprovalBoxState,
    detailData,
    setDetailData,
    state,
  } = useApprovalBoxManage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (state.insertStatus === 1) {
          return;
        }

        const response = await getBoxUseDept(props.boxId);

        // 받아온 데이터를 detailData.scope에 할당
        if (response && response.data) {
          setDetailData((prevState) => ({
            ...prevState,
            scope: response.data, // 여기서는 response.data가 예시의 데이터 구조와 동일하다고 가정
          }));
        }
      } catch (err) {
        console.error('Error fetching box details:', err);
      }
    };
    fetchData();
  }, [props.boxId]);

  useEffect(() => {
    setApprovalBoxState((prevState) => ({
      ...prevState,
      menuUsingRange: props.menuOption,
    }));
  }, [props.menuOption, setApprovalBoxState]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  // 모달을 닫기 위한 함수
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const dataUpdateHandler = (id, data) => {
    setDetailData({ ...detailData, [id]: data });
    console.log(detailData);
  };

  const scopeConfirm = (data) => {
    dataUpdateHandler('scope', data);
  };

  const scopefilterHandler = (id, category, useId) => {
    let filetedData = detailData.scope.filter((ele) => {
      if (ele.category === category && ele.useId === useId) {
        return false;
      }
      return true;
    });
    setDetailData({ ...detailData, [id]: filetedData });
  };

  const handleMenuOptionChange = (event) => {
    props.setMenuOption(event.target.value);
  };

  useEffect(() => {
    if (state.insertStatus === 1) {
      setDetailData((prevState) => ({
        ...prevState,
        scope: [], // 초기화
      }));
    }
  }, [state.insertStatus]);

  return (
    <div className={styled.inputItem}>
      <div style={props.commonCellStyle}>
        <div className={styled.text}>메뉴 사용범위</div>
      </div>
      <div style={props.commonDataStyle}>
        <Radiobtn
          labels={['전체', '선택']}
          values={['T', 'P']} // 여기에 values 추가
          selectedOption={props.menuOption}
          onChange={handleMenuOptionChange}
        />
        {props.menuOption === 'P' && ( // menuOption이 'P'일 때만 렌더링
          <div className={styled.viewUseField}>
            <AreaBox
              id={'scope'}
              data={detailData.scope}
              dataHandler={scopefilterHandler}
              children={
                <OrgChart
                  view={'user'}
                  initData={detailData.scope.map((ele, index) => {
                    ele.id = index;
                    return ele;
                  })}
                  isModalOpen={isModalOpen}
                  openModal={openModal}
                  closeModal={closeModal}
                  confirmHandler={scopeConfirm}
                />
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
export default MenuUseRange;
