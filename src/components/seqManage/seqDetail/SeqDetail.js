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
import { useAlert } from '../../../contexts/AlertContext';

export default function SeqDetail({ searchHandler }) {
  const { detailData, flagData } = useSeqManage();
  const { showLoading, hideLoading } = useLoading();
  const { showAlert } = useAlert();

  const createNewSeq = () => {
    insertSeq(detailData)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        showAlert({
          severity: 'success',
          message: `새 채번이 생성되었습니다.`,
        });
      })
      .then(() => {
        searchHandler();
      })
      .catch((err) => {
        showAlert({
          severity: 'error',
          message: `채번 생성에 실패했습니다. [${err}]`,
        });
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
        showAlert({
          severity: 'success',
          message: `채번이 수정되었습니다.`,
        });
      })
      .then(() => {
        searchHandler();
      })
      .catch((err) => {
        showAlert({
          severity: 'error',
          message: `채번 수정에 실패했습니다. [${err}]`,
        });
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
          showAlert({
            severity: 'info',
            message: errors.message,
          });
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
          showAlert({
            severity: 'info',
            message: errors.message,
          });
        });
    }
  };

  const returnTitleComponent = () => {
    return (
      <>
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
        font_size="16px"
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
