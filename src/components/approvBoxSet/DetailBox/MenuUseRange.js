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
    setApprovalBoxState2,
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

        // 받아온 데이터를 detailData.scope에 할당하면서 id 부여
        if (response && response.data) {
          const dataWithIds = response.data.map((item, index) => ({
            category: item.category || '',
            compId: item.compId || '',
            company: item.company || '',
            department: item.department || '',
            deptId: item.deptId || '',
            estId: item.estId || '',
            establishment: item.establishment || '',
            grade: item.grade || '',
            id: index + 1,
            position: item.position || '',
            useId: item.useId || '',
            user: item.user || '',
            userId: item.userId || '',
          }));
          console.log(dataWithIds);

          setApprovalBoxState2((prevState) => ({
            ...prevState,
            boxUseDept: dataWithIds,
          }));

          setDetailData((prevState) => ({
            ...prevState,
            scope: dataWithIds,
            scope2: response.data, // 원본 데이터를 scope2에 저장
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

  useEffect(() => {
    setApprovalBoxState2((prevState) => ({
      ...prevState,
      menuUsingRange: props.menuOption,
    }));
  }, [props.menuOption]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  // 모달을 닫기 위한 함수
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const dataUpdateHandler = (id, data) => {
    setDetailData({ ...detailData, [id]: data });
  };

  const scopeConfirm = (data) => {
    dataUpdateHandler('scope', data);

    setApprovalBoxState((prevState) => ({
      ...prevState,
      boxUseDept: data,
    }));
    setApprovalBoxState2((prevState) => ({
      ...prevState,
      boxUseDept: data,
    }));
  };

  const scopefilterHandler = (id, category, useId) => {
    let filteredData = detailData.scope.filter((ele) => {
      if (ele.category === category && ele.useId === useId) {
        return false;
      }
      return true;
    });

    setDetailData((prevData) => {
      const updatedData = { ...prevData, [id]: filteredData };

      // Update the viewItem in approvalBoxState
      setApprovalBoxState((prevState) => ({
        ...prevState,
        boxUseDept: updatedData.scope,
      }));

      // Update the viewItem in approvalBoxState2
      setApprovalBoxState2((prevState) => ({
        ...prevState,
        boxUseDept: updatedData.scope,
      }));

      return updatedData;
    });
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
  }, [state.insertStatus, state.count]);

  return (
    <div className={styled.inputItem}>
      <div style={props.commonCellStyle}>
        <div className={styled.text}>
          <span className={styled.notnull}>*</span>메뉴 사용범위
        </div>
      </div>
      <div style={props.commonDataStyle}>
        <Radiobtn
          labels={['전체', '선택']}
          values={['T', 'P']}
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
