import React, { useState, useEffect } from 'react';
import { columns } from '../../../../assets/datas/form_approval_line';
import { useFormManage } from '../../../../contexts/FormManageContext';
import DataList from '../../../common/DataList';
import { DetailBox, TitleBox, RadioBox } from './DetailTableItem';
import styled from '../../../../styles/components/formManage/formDetail/components/DetailTableDAL.module.css';
import OrgChart from '../../../org/OrgChart';

export default function DetailTableDAL() {
  const { detailData, setDetailData } = useFormManage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const modalConfirm = (data) => {
    data = data.map((ele, index) => {
      ele.lineOrder = index + 1;
      ele.approvalKind = '결재(기본프로세스)';
      ele.compName = ele.company;
      ele.estName = ele.establishment;
      ele.deptName = ele.department;
      ele.userName = ele.user;
      return ele;
    });
    dataUpdateHandler('approvalLine', data);
  };

  //결재라인 핸들러
  const dataHandler = (data) => {
    console.log(data);
  };

  const dataUpdateHandler = (id, data) => {
    console.log('changed:', data);
    setDetailData({ ...detailData, [id]: data });
  };

  const buttons = [
    {
      name: '사용',
      value: true,
    },
    { name: '미사용', value: false },
  ];

  return (
    <>
      <DetailBox
        children={
          <>
            <TitleBox title={'기본 결재라인 사용여부'} />
            <RadioBox
              id={'approvalLineStatus'}
              buttons={buttons}
              data={detailData.approvalLineStatus}
              dataHandler={dataUpdateHandler}
            ></RadioBox>
          </>
        }
      ></DetailBox>
      <div className={styled.subBox}>
        <OrgChart
          view={'user'}
          initData={detailData.approvalLine.map((ele, index) => {
            ele.id = index;
            ele.company = ele.compName;
            ele.establishment = ele.estName;
            ele.department = ele.deptName;
            ele.user = ele.userName;
            ele.grade = ele.gradeName;
            ele.position = ele.positionName;
            return ele;
          })}
          isModalOpen={isModalOpen}
          openModal={openModal}
          closeModal={closeModal}
          confirmHandler={modalConfirm}
          comp={detailData.compId > 1 ? detailData.compId : 0}
        />
      </div>
      <div className={styled.dalBox}>
        <DataList
          rows={detailData.approvalLine.map((ele) => {
            ele.company = ele.compName;
            ele.establishment = ele.estName;
            ele.department = ele.deptName;
            ele.user = ele.userName;
            return ele;
          })}
          columns={columns}
          dataHandler={dataHandler}
        />
      </div>
    </>
  );
}
