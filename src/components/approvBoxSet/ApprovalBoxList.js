import React, { useState, useEffect } from 'react';
import styled from '../../styles/components/ApprovalBox/ApprovalBoxList.module.css';
import { BiSolidFolder } from 'react-icons/bi';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import getDocBoxList from '../../apis/approvalBoxAPI/getApprovalBox';
import { useApprovalBoxManage } from '../../contexts/ApprovalBoxManageContext';
import deleteApprovalBox from '../../apis/approvalBoxAPI/deleteApprovalBox';
import PopUp from '../common/PopUp';
import Button from '../common/Button';

function ApprovalBoxList({ companyId }) {
  const {
    state,
    setState,
    approvalBoxState,
    setApprovalBoxState,
    approvalBoxInit,
  } = useApprovalBoxManage();
  const [selectedBoxId, setSelectedBoxId] = useState(null);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  function boxNameClickHandler(boxId) {
    setState((prevState) => ({
      ...prevState,
      boxId: boxId,
      insertStatus: 0,
    }));
    setApprovalBoxState((prevState) => ({
      ...prevState,
      approvalBoxId: boxId,
    }));
  }

  const fetchApprovalBoxList = async () => {
    try {
      const company = companyId;
      const response = await getDocBoxList(company);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const deleteBtnHandler = async () => {
    try {
      await deleteApprovalBox(selectedBoxId);
      closeModal();
      fetchApprovalBoxList(); // 삭제 후 새로운 목록 가져오기
    } catch (error) {
      console.error('Error deleting box:', error);
    }
  };

  useEffect(() => {
    fetchApprovalBoxList();
  }, [companyId, state.insertStatus]);

  return (
    <div>
      {data.map((item) => (
        <div key={item.approvalBoxId} className={styled.itemBox}>
          <div className={styled.iconimg}>
            <BiSolidFolder style={{ fontSize: '18px', color: '#f7b84b' }} />
          </div>
          <div
            className={styled.boxName}
            onClick={() => boxNameClickHandler(item.approvalBoxId)}
            style={
              state.boxId === item.approvalBoxId ? { fontWeight: 650 } : {}
            }
          >
            {item.approvalBoxName}
          </div>
          <PopUp
            label={<div className={styled.deleteButton}>삭제</div>}
            title="결재함 삭제"
            width="400px"
            height="200px"
            isModalOpen={isModalOpen}
            closeModal={closeModal}
            openModal={() => {
              setSelectedBoxId(item.approvalBoxId);
              openModal();
            }}
            btnStyle="popup_non_btn"
            btnWidth="5px"
            btnheight="30px"
            children={
              <div style={{ textAlign: 'center', padding: '30px' }}>
                정말로 삭제하시겠습니까?
                <div style={{ marginTop: '40px' }}>
                  <Button
                    btnStyle="gray_btn"
                    label="취소"
                    onClick={closeModal}
                  />
                  <Button
                    btnStyle="blue_btn"
                    label="확인"
                    onClick={() => deleteBtnHandler(item.approvalBoxId)}
                  />
                </div>
              </div>
            }
          />
        </div>
      ))}
    </div>
  );
}

export default ApprovalBoxList;
