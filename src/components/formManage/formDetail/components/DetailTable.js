import React, { useEffect, useState } from 'react';
import {
  DetailBox,
  TitleBox,
  InputBox,
  FileBox,
  AreaBox,
  RadioBox,
  SelectBox,
} from './DetailTableItem';
import { useFormManage } from '../../../../contexts/FormManageContext';
import OrgChart from '../../../org/OrgChart';
import styled from '../../../../styles/components/formManage/formDetail/components/DetailTable.module.css';

export default function DetailTable() {
  const { detailData, flagData, setDetailData, setDetailDataById, setData } =
    useFormManage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const compDataUpdateHandler = (id, data, label) => {
    setDetailData({
      ...detailData,
      scope:
        label !== 'Group'
          ? [{ category: 'C', compId: data, company: label, useId: data }]
          : [],
      [id]: data,
    });
  };

  const scopeConfirm = (data) => {
    console.log('scope:', data);
    setDetailDataById('scope', data);
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

  const radioButtons = [
    {
      name: '사용',
      value: true,
    },
    { name: '미사용', value: false },
  ];

  useEffect(() => {
    console.log('detail:', detailData);
  }, [detailData]);

  return (
    <div className={styled.detailContainer}>
      <DetailBox
        children={
          <>
            <TitleBox title={'회사명'} />
            {flagData === 1 ? (
              <SelectBox
                id={'compId'}
                data={setData.compList.filter((ele) => {
                  return ele.id > 0;
                })}
                dataHandler={compDataUpdateHandler}
              />
            ) : (
              <InputBox
                id={'compId'}
                data={detailData.compName}
                dataHandler={setDetailDataById}
                disabled={true}
              />
            )}
          </>
        }
      ></DetailBox>
      <DetailBox
        children={
          <>
            <TitleBox
              title={
                <>
                  <span className={styled.notnull}>*</span>
                  {'양식명'}
                </>
              }
            />
            <InputBox
              id={'formName'}
              data={detailData.formName}
              dataHandler={setDetailDataById}
            />
          </>
        }
      ></DetailBox>
      <DetailBox
        children={
          <>
            <TitleBox title={'결재종류'} />
            {flagData === 1 ? (
              <SelectBox
                id={'approvalKind'}
                data={setData.approvalKindList}
                dataHandler={setDetailDataById}
              />
            ) : (
              <SelectBox
                id={'approvalKind'}
                data={setData.approvalKindList}
                init={detailData.approvalKind}
                dataHandler={setDetailDataById}
              />
            )}
          </>
        }
      ></DetailBox>
      <DetailBox
        children={
          <>
            <TitleBox
              title={
                <>
                  <span className={styled.notnull}>*</span>
                  {'공개범위'}
                </>
              }
            />
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
                  comp={detailData.compId > 1 ? detailData.compId : 0}
                />
              }
            />
          </>
        }
      ></DetailBox>
      <DetailBox
        children={
          <>
            <TitleBox title={'사용여부'} />
            <RadioBox
              id={'status'}
              buttons={radioButtons}
              data={detailData.status}
              dataHandler={setDetailDataById}
            ></RadioBox>
          </>
        }
      ></DetailBox>
      <DetailBox
        children={
          <>
            <TitleBox title={'양식설명'} />
            <InputBox
              id={'formExplain'}
              data={detailData.formExplain}
              dataHandler={setDetailDataById}
            />
          </>
        }
      ></DetailBox>
      <DetailBox
        children={
          <>
            <TitleBox
              title={
                <>
                  <span className={styled.notnull}>*</span>
                  {'기본파일'}
                </>
              }
            />
            <FileBox
              id={'defaultForm'}
              name={'기본파일'}
              data={detailData.defaultForm}
              dataHandler={setDetailDataById}
            />
          </>
        }
      ></DetailBox>
      <DetailBox
        children={
          <>
            <TitleBox title={'본문파일'} />
            <FileBox
              id={'mainForm'}
              name={'본문파일'}
              data={detailData.mainForm}
              dataHandler={setDetailDataById}
            />
          </>
        }
      ></DetailBox>
    </div>
  );
}
