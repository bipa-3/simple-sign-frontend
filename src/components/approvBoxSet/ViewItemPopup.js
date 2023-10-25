import React, { useEffect, useState } from 'react';
import styled from '../../styles/pages/ApprovalBoxSetPage.module.css';
import PopUp from '../common/PopUp';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import { useApprovalBoxManage } from '../../contexts/ApprovalBoxManageContext';
import PopUpFoot from '../common/PopUpFoot';

function ViewItemPopup({ checkedItems, currentViewItems, onSave }) {
  const [selectAll, setSelectAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { approvalBoxState, setApprovalBoxState, setApprovalBoxState2 } =
    useApprovalBoxManage();
  const [savedItems, setSavedItems] = useState([]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [checkboxStates, setCheckboxStates] = useState({
    상신내역: false,
    미결내역: false,
    '기결내역-종결': false,
    '기결내역-진행': false,
    반려내역: false,
    수신참조내역: false,
  });

  useEffect(() => {
    // currentViewItems의 변경을 감지하고 checkboxStates 업데이트
    const updatedCheckboxStates = {};

    // 모든 항목에 대해 체크 여부를 결정
    for (const key in checkboxStates) {
      updatedCheckboxStates[key] = currentViewItems.includes(key);
    }

    setCheckboxStates(updatedCheckboxStates);
  }, [currentViewItems]);

  useEffect(() => {
    const initialCheckboxStates = {
      상신내역: savedItems.includes('상신내역'),
      미결내역: savedItems.includes('미결내역'),
      '기결내역-종결': savedItems.includes('기결내역-종결'),
      '기결내역-진행': savedItems.includes('기결내역-진행'),
      반려내역: savedItems.includes('반려내역'),
      수신참조내역: savedItems.includes('수신참조내역'),
    };

    setCheckboxStates(initialCheckboxStates);
  }, [checkedItems, savedItems]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    const newCheckboxStates = { ...checkboxStates };
    for (const key in newCheckboxStates) {
      newCheckboxStates[key] = !selectAll;
    }
    setCheckboxStates(newCheckboxStates);
  };

  const handleCheckboxChange = (itemName) => {
    const newCheckboxStates = { ...checkboxStates };
    newCheckboxStates[itemName] = !newCheckboxStates[itemName];
    setCheckboxStates(newCheckboxStates);

    // 모든 체크박스가 체크되어 있는지 확인
    const allChecked = Object.values(newCheckboxStates).every(
      (value) => value === true
    );

    setSelectAll(allChecked);
  };

  const handleSave = () => {
    // 선택된 값을 저장하는 코드
    const selectedItems = Object.keys(checkboxStates).filter(
      (itemName) => checkboxStates[itemName]
    );
    setSavedItems(selectedItems);
    setApprovalBoxState((prevState) => ({
      ...prevState,
      viewItems: selectedItems,
    }));
    setApprovalBoxState2((prevState) => ({
      ...prevState,
      viewItems: selectedItems,
    }));

    onSave && onSave(selectedItems);

    closeModal();
  };

  const submitBtn = [
    {
      label: '취소',
      onClick: () => {
        closeModal();
      },
      btnStyle: 'light_btn',
    },
    {
      label: '반영',
      onClick: () => {
        handleSave();
      },
      btnStyle: 'blue_btn',
    },
  ];

  return (
    <PopUp
      label={<GridViewRoundedIcon style={{ fontSize: '20px' }} />}
      title="조회항목 선택"
      width="400px"
      height="480px"
      isModalOpen={isModalOpen}
      openModal={openModal}
      closeModal={closeModal}
      btnStyle={'grey_btn'}
      btnWidth="30px"
      btnHeihgt="30px"
      children={
        <div style={{ height: '100%' }}>
          <div className={styled.viewItemContainer}>
            <div className={styled.viewItemList}>
              <div className={styled.viewitem}>
                <div className={styled.topCheckbox}>
                  <input
                    type="checkbox"
                    value="selectAll"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </div>
                <div className={styled.topViewItem}>조회항목</div>
              </div>
              {Object.keys(checkboxStates).map((itemName, index) => (
                <div className={styled.itemcontainer} key={index}>
                  <div className={styled.viewitem}>
                    <div className={styled.checkbox}>
                      <input
                        type="checkbox"
                        value={itemName}
                        checked={checkboxStates[itemName]}
                        onChange={() => handleCheckboxChange(itemName)}
                      />
                    </div>
                    <div
                      className={styled.itemName}
                      onClick={() => handleCheckboxChange(itemName)}
                    >
                      {itemName}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <PopUpFoot buttons={submitBtn} />
        </div>
      }
    />
  );
}

export default ViewItemPopup;
