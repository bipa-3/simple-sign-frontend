import React, { useState } from 'react';
import DetailTable from './components/DetailTable';
import Button from '../../common/Button';
import InnerBox from '../../common/InnerBox';
import { useFormManage } from '../../../contexts/FormManageContext';
import insertForm from '../../../apis/formManageAPI/insertForm';
import updateForm from '../../../apis/formManageAPI/updateForm';
import FormDetailNav from './components/FormDetailNav';
import { useLoading } from '../../../contexts/LoadingContext';
import {
  checkFormCreateData,
  checkFormUpdateData,
} from '../../../validation/formManage/formSchema';
import DetailTableDAL from './components/DetailTableDAL';

export default function FormDetail({ searchHandler }) {
  const { detailData, flagData } = useFormManage();
  const [activeButton, setActiveButton] = useState(1);
  const { showLoading, hideLoading } = useLoading();

  // 상세 항목 선택
  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
  };

  const createNewForm = () => {
    insertForm(detailData)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        alert('새 양식이 생성되었습니다.');
      })
      .then(() => {
        searchHandler();
      })
      .catch((err) => {
        alert('에러가 발생했습니다.');
      })
      .finally(() => {
        hideLoading();
      });
  };

  const updateExistForm = () => {
    updateForm(detailData)
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
        alert('에러가 발생했습니다.');
      })
      .finally(() => {
        hideLoading();
      });
  };

  // 업데이터 유효성 검사
  const updateDetailFunc = () => {
    if (flagData === 2) {
      checkFormUpdateData(detailData)
        .then(() => {
          showLoading();
          updateExistForm();
        })
        .catch((errors) => {
          alert(errors.message);
        });
    }
  };

  // 생성 유효성 검사
  const createDetailFunc = () => {
    if (flagData === 1) {
      checkFormCreateData(detailData)
        .then(() => {
          showLoading();
          createNewForm();
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
        <FormDetailNav
          activeButton={activeButton}
          handleButtonClick={handleButtonClick}
        ></FormDetailNav>
        {activeButton === 1 ? <DetailTable /> : <DetailTableDAL />}
      </>
    );
  };

  return (
    <InnerBox
      text={'양식상세'}
      width={'100%'}
      height={'100%'}
      titleChildren={returnTitleComponent()}
      childStyle={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        padding: '0px 0px 20px 0px',
      }}
      children={returnMainComponent()}
    ></InnerBox>
  );
}
