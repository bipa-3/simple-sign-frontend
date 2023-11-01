import React, { useState } from 'react';
import styled from '../../../styles/components/formManage/formDetail/FormDetail.module.css';
import SeqDetailTable from './components/SeqDetailTable';
import Button from '../../common/Button';
import { useSeqManage } from '../../../contexts/SeqManageContext';
import InnerBox from '../../common/InnerBox';
import insertSeq from '../../../apis/seqManageAPI/insertSeq';
import updateSeq from '../../../apis/seqManageAPI/updateSeq';
import { useLoading } from '../../../contexts/LoadingContext';
import {
  checkSeqCreateData,
  checkSeqUpdateData,
} from '../../../validation/seqManage/seqSchema';

export default function SeqDetail({ searchHandler }) {
  const { detailData, flagData, createDetailData } = useSeqManage();
  const { showLoading, hideLoading } = useLoading();

  const createNewSeq = () => {
    insertSeq(detailData)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        alert('새 채번이 생성되었습니다.');
      })
      .then(() => {
        searchHandler();
      })
      .catch((err) => {
        console.error(err);
        if (err.message === '404') {
          alert('검색된 데이터가 없습니다.');
        }
      })
      .finally(() => {
        hideLoading();
      });
  };

  const updateExistSeq = () => {
    updateSeq(detailData)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        alert('양식이 수정되었습니다.');
      })
      .then(() => {
        searchHandler();
      })
      .catch((err) => {
        console.error(err);
        if (err.message === '404') {
          alert('검색된 데이터가 없습니다.');
        }
      })
      .finally(() => {
        hideLoading();
      });
  };

  const updateDetailFunc = () => {
    if (flagData === 2) {
      checkSeqUpdateData(detailData)
        .then(() => {
          showLoading();
          updateExistSeq();
        })
        .catch((errors) => {
          alert(errors.message);
        });
    }
  };

  const createDetailFunc = () => {
    if (flagData === 1) {
      checkSeqCreateData(detailData)
        .then(() => {
          showLoading();
          createNewSeq();
        })
        .catch((errors) => {
          alert(errors.message);
        });
    }
  };

  const returnTitleComponent = () => {
    return (
      <>
        <Button
          label={'추가'}
          btnStyle={'gray_btn'}
          onClick={createDetailData}
        />
        <Button
          label={flagData === 1 ? '저장' : '수정'}
          btnStyle={'green_btn'}
          onClick={flagData === 1 ? createDetailFunc : updateDetailFunc}
        />
      </>
    );
  };

  const returnMainComponent = () => {
    return (
      <>
        <SeqDetailTable />
      </>
    );
  };

  return (
    <>
      <InnerBox
        text={'문서채번상세'}
        width={'100%'}
        height={'100%'}
        titleChildren={returnTitleComponent()}
        childStyle={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          padding: '0px 0px 25px 0px',
        }}
        children={returnMainComponent()}
      ></InnerBox>
    </>
  );
}
