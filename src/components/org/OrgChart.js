import React, { useState, useEffect, useMemo } from 'react';
import OrgTreeView from './OrgTreeView';
import OrgTopGrid from './OrgTopGrid';
import OrgBottomGrid from './OrgBottomGrid';
import OrgSearch from './OrgSearch';
import styled from '../../styles/components/org/OrgPage.module.css';
import PopUp from '../common/PopUp';
import PopUpFoot from '../common/PopUpFoot';
import { RiOrganizationChart } from 'react-icons/ri';

/**
 * 
 * @param {String} view 사용자 - user, 부서별 - dept ex) const view = 'user';
 * @param {Object} initData compId:1, company:"Company A", department:"test Department", deptId:4, estId:1, establishment:"Establishment 1",
                            grade:"", id:1, position:"", user:"", userId:0
 * @param {Function} isModalOpen  모달 여는 메서드 const openModal = () => {setIsModalOpen(true)};
 * @param {Function} closeModal 모달 닫는 메서드 const closeModal = () => {setIsModalOpen(false)};
 * @param {Boolean} openModal 모달 상태값 const [isModalOpen, setIsModalOpen] = useState(false); //isModalOpen 데이터
 * @param {Function} confirmHandler 확인버튼 이벤트 confirmHandler(dataForParent); //dataForParent는 리턴 데이터
 * @returns ex) {estId: 1, estName: 'Establishment 1'}
                {deptId: 1, deptName: 'HR Department'}
                {deptId: 12, deptName: 'HR Department 2'}
 */

export default function OrgChart({
  view,
  initData,
  isModalOpen,
  openModal,
  closeModal,
  confirmHandler,
}) {
  // view
  // 임시 상태값 저장 set 메서드
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedRow, setSelectedRow] = useState([]);
  const removeRow = (rowId) => {
    setSelectedRow((prevRows) => prevRows.filter((row) => row.id !== rowId));
  };

  useEffect(() => {
    setSelectedRow(() => [...initData]);
  }, [initData]);

  const [isChecked, setIsChecked] = useState(false);

  const [search, setSearch] = useState({});

  const handleRow = (row) => {
    const isDuplicate = selectedRow.some(
      (selected) =>
        selected.company === row.company &&
        selected.establishment === row.establishment &&
        selected.department === row.department &&
        selected.position === row.position &&
        selected.grade === row.grade &&
        selected.user === row.user
    );
    if (!isDuplicate) {
      const newId =
        selectedRow.length > 0 ? selectedRow[selectedRow.length - 1].id + 1 : 1;
      const updatedRow = { ...row, id: newId };
      setSelectedRow((prevRows) => [...prevRows, updatedRow]);
    } else {
      alert('이미 들어가있는 값입니다.');
    }
  };

  // return되는 데이터 매핑
  const dataForParent = useMemo(() => {
    return selectedRow.map((row) => {
      let returnObj = {
        category: '',
        compId: 0,
        company: '',
        department: '',
        deptId: 0,
        estId: 0,
        establishment: '',
        grade: '',
        position: '',
        useId: 0,
        user: '',
        userId: 0,
      };
      if (view === 'user' && row.userId && row.user) {
        return {
          ...returnObj,
          category: 'U',
          useId: row.userId,
          userId: row.userId,
          user: row.user,
          grade: row.grade,
          position: row.position,
          deptId: row.deptId,
          department: row.department,
          estId: row.estId,
          establishment: row.establishment,
          compId: row.compId,
          company: row.company,
        };
      } else if (row.deptId && row.department) {
        return {
          ...returnObj,
          category: 'D',
          useId: row.deptId,
          deptId: row.deptId,
          department: row.department,
          estId: row.estId,
          establishment: row.establishment,
          compId: row.compId,
          company: row.company,
        };
      } else if (view === 'dept' && row.estId && row.establishment) {
        return {
          ...returnObj,
          category: 'E',
          useId: row.estId,
          estId: row.estId,
          establishment: row.establishment,
          compId: row.compId,
          company: row.company,
        };
      } else if (row.compId && row.company) {
        return {
          ...returnObj,
          category: 'C',
          useId: row.compId,
          compId: row.compId,
          company: row.company,
        };
      }
      return {};
    });
  }, [selectedRow, view]);

  const grayAndBlueBtn = [
    {
      label: '취소',
      onClick: () => {
        closeModal();
      },
      btnStyle: 'popup_gray_btn',
    },
    {
      label: '반영',
      onClick: () => {
        confirmHandler(dataForParent);
        closeModal();
      },
      btnStyle: 'popup_blue_btn',
    },
  ];

  // const dataForParent = useMemo(() => {
  //   return selectedRow.map((row) => {
  //     return {
  //       compId: row.compId,
  //       compName: row.company,
  //       estId: row.estId,
  //       estName: row.establishment,
  //       deptId: row.deptId,
  //       deptName: row.department,
  //       userId: row.userId,
  //       userName: row.user,
  //     };
  //   });
  // }, [selectedRow]);

  // useEffect(() => {
  //   console.log(dataForParent);
  //   if (onDataUpdate) {
  //     onDataUpdate(dataForParent);
  //   }
  // }, [dataForParent]);

  const getOrgChart = () => {
    return (
      <div className={styled.main_container}>
        <div className={styled.search_container}>
          <OrgSearch
            view={view}
            onCheckBox={setIsChecked}
            onSearch={setSearch}
          />
        </div>
        <div className={styled.top_container}>
          <div className={styled.tree_container}>
            <OrgTreeView onNodeSelect={setSelectedNode} />
          </div>
          <div className={styled.second_container}>
            <div className={styled.top_grid_container}>
              <OrgTopGrid
                selectedNode={selectedNode}
                onRowSelect={handleRow}
                view={view}
                isChecked={isChecked}
                search={search}
                setSelectedNode={setSelectedNode}
                setSearch={setSearch}
              />
            </div>
            <div className={styled.bottom_grid_container}>
              <div className={styled.bottom_grid_label_view}>
                <label>선택항목</label>
                <OrgBottomGrid
                  selectedRow={selectedRow}
                  view={view}
                  remove={removeRow}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <PopUp
      label={<RiOrganizationChart />}
      width={'1200px'}
      height={'700px'}
      title={'부서사업장사용자팝업'}
      isModalOpen={isModalOpen}
      openModal={openModal}
      closeModal={closeModal}
      btnWidth="30px"
      btnHeihgt="30px"
      children={
        <>
          {getOrgChart()}
          <PopUpFoot buttons={grayAndBlueBtn} />
        </>
      }
    />
  );
}
