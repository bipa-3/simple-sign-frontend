import React, { useState, useEffect } from 'react';
import styled from '../../styles/components/ApprovalBox/ApprovalBoxList.module.css';
import { BiSolidFolder } from 'react-icons/bi';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import getDocBoxList from '../../apis/approvalBoxAPI/getApprovalBox';
import { useApprovalBoxManage } from '../../contexts/ApprovalBoxManageContext';
import deleteApprovalBox from '../../apis/approvalBoxAPI/deleteApprovalBox';
import PopUp from '../common/PopUp';
import Button from '../common/Button';

function ApprovalBoxList({ companyId, searchQuery }) {
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
  const [filteredData, setFilteredData] = useState([]); // 검색된 데이터를 관리

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
      setState((prevState) => ({
        ...prevState,
        boxList: [...result],
      }));
      return result;
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  };

  const deleteBtnHandler = async (boxId) => {
    try {
      await deleteApprovalBox(boxId);
      closeModal();
      const updatedBoxList = await fetchApprovalBoxList(); // 삭제 후 새로운 목록 가져오기

      // 현재 선택된 박스와 삭제된 박스가 같은 경우
      if (state.boxId === boxId) {
        // boxList가 비어있지 않으면 첫 번째 박스를 선택

        if (updatedBoxList.length > 0 && updatedBoxList.length > 0) {
          const newSelectedBoxId = state.boxList[0].approvalBoxId;
          boxNameClickHandler(newSelectedBoxId);
        } else {
          setState((prevState) => ({
            ...prevState,
            boxId: null,
          }));
        }
      } else {
        if (state.boxList.length == 0 || state.boxList.length == undefined) {
          setState((prevState) => ({
            ...prevState,
            boxId: null,
          }));
        }
      }
    } catch (error) {
      console.error('Error deleting box:', error);
    }
  };

  useEffect(() => {
    fetchApprovalBoxList();
  }, [companyId, state.insertStatus, state.saveStatus]);
  useEffect(() => {
    // boxList가 업데이트되면 첫 번째 박스 선택
    if (state.boxList && state.boxList.length > 0) {
      boxNameClickHandler(state.boxList[0].approvalBoxId);
    }
  }, [state.boxList]);

  useEffect(() => {
    const newFilteredData = data.filter((item) =>
      item.approvalBoxName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(newFilteredData);
  }, [searchQuery, data]);

  return (
    <div>
      {filteredData.map((item) => (
        <div key={item.approvalBoxId} className={styled.itemBox}>
          <div className={styled.iconimg}>
            <BiSolidFolder style={{ fontSize: '18px', color: '#f7b84b' }} />
          </div>
          <div
            className={`${styled.boxName} ${
              item.approvalBoxUsedStatus === 0 ? styled.dimmed : ''
            }`}
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
            backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
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
                    btnStyle="light_btn"
                    label="취소"
                    onClick={closeModal}
                  />
                  <Button
                    btnStyle="blue_btn"
                    label="확인"
                    onClick={() => deleteBtnHandler(selectedBoxId)}
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
