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
  const { detailData, flagData, setDetailData, setData } = useFormManage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const dataUpdateHandler = (id, data) => {
    setDetailData({ ...detailData, [id]: data });
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

  const buttons = [
    {
      name: '사용',
      value: true,
    },
    { name: '미사용', value: false },
  ];

  // useEffect(() => {
  //   console.log('data:', detailData);
  // }, [detailData]);

  return (
    <div className={styled.detailContainer}>
      <DetailBox
        children={
          <>
            <TitleBox title={'회사명'} />
            {flagData === 1 ? (
              <SelectBox
                id={'compId'}
                data={setData.compList}
                dataHandler={dataUpdateHandler}
              />
            ) : (
              <InputBox
                id={'compId'}
                data={detailData.compName}
                dataHandler={dataUpdateHandler}
                disabled={true}
              />
            )}
          </>
        }
      ></DetailBox>
      <DetailBox
        children={
          <>
            <TitleBox title={'양식명'} />
            <InputBox
              id={'formName'}
              data={detailData.formName}
              dataHandler={dataUpdateHandler}
            />
          </>
        }
      ></DetailBox>
      <DetailBox
        children={
          <>
            <TitleBox title={'공개범위'} />
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
          </>
        }
      ></DetailBox>
      <DetailBox
        children={
          <>
            <TitleBox title={'사용여부'} />
            <RadioBox
              id={'status'}
              buttons={buttons}
              data={detailData.status}
              dataHandler={dataUpdateHandler}
            ></RadioBox>
          </>
        }
      ></DetailBox>
      <DetailBox
        children={
          <>
            <TitleBox title={'기본파일'} />
            <FileBox
              id={'defaultForm'}
              name={'기본파일'}
              data={detailData.defaultForm}
              dataHandler={dataUpdateHandler}
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
              dataHandler={dataUpdateHandler}
            />
          </>
        }
      ></DetailBox>
    </div>
  );
}
