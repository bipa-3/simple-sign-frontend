import React, { useEffect, useState } from 'react';
import styled from '../styles/pages/FormManagePage.module.css';
import FormSearchBox from '../components/formManage/searchBox/FormSearchBox';
import FormDetail from '../components/formManage/formDetail/FormDetail';
import FormListArea from '../components/formManage/formList/FormListArea';
import getCompanyList from '../apis/commonAPI/getCompanyList';
import getFormAndCompList from '../apis/formManageAPI/getFormAndCompList';
import { useFormManage } from '../contexts/FormManageContext';
import { usePage } from '../contexts/PageContext';
import { useLoading } from '../contexts/LoadingContext';
import { checkSearchData } from '../validation/formManage/searchSchema';
import { getAuthrity } from '../utils/getUser';
import getApprovalKind from '../apis/commonAPI/getApprovalKind';
import { useAlert } from '../contexts/AlertContext';

export default function FormManagePage() {
  const [formListData, setFormListData] = useState([]);
  const { searchData, setData, setSearchDataById, setSetData } =
    useFormManage();
  const { showLoading, hideLoading } = useLoading();
  const { state, setState } = usePage();
  const { showAlert } = useAlert();
  const [defaultFlag, setDefaultFlag] = useState(false);

  const searchFormData = () => {
    getFormAndCompList(searchData)
      .then((res) => {
        if (!(res.status >= 200 && res.status < 300)) {
          throw new Error(res.status);
        }
        if (res.status === 204) {
          return [];
        }
        return res.json();
      })
      .then((data) => {
        if (data.length < 1) {
          showAlert({
            severity: 'info',
            message: '검색된 목록이 없습니다.',
          });
        }
        setFormListData(data);
      })
      .catch((err) => {
        // showAlert({
        //   severity: 'error',
        //   message: `양식목록 조회에 실패했습니다.`,
        // });
        setFormListData([]);
      })
      .finally(() => {
        hideLoading();
      });
  };

  const setDetaultData = () => {
    showLoading();
    Promise.all([getCompanyList(), getApprovalKind()])
      .then(([compListRes, approvalKindRes]) => {
        return Promise.all([compListRes.json(), approvalKindRes.json()]);
      })
      .then(([compListData, approvalKindData]) => {
        if (getAuthrity() === '1') {
          compListData = [{ id: 0, name: '전체' }, ...compListData];
        }

        const approvalKindResult = approvalKindData.map((ele) => {
          ele.id = ele.id.toString().padStart(2, '0');
          return ele;
        });

        setSearchDataById('compId', compListData[0].id);
        setSetData({
          ...setData,
          compList: compListData,
          approvalKindList: approvalKindResult,
        });
      })
      .then(() => {
        setDefaultFlag(true);
      })
      .catch((err) => {
        // showAlert({
        //   severity: 'error',
        //   message: `기본 데이터 조회를 실패했습니다. [${err}]`,
        // });
      })
      .finally(() => {
        hideLoading();
      });
  };

  // 검색 및 테이블 데이터 셋팅
  const searchHandler = () => {
    checkSearchData(searchData).then(() => {
      showLoading();
      searchFormData();
    });
  };

  useEffect(() => {
    //페이지 데이터 셋팅
    setState({ ...state, curPage: '기안양식관리' });

    //기본 데이터 셋팅
    setDetaultData();

    return () => {
      setSearchDataById('status', 1);
    };
  }, []);

  //기본 항목 검색
  useEffect(() => {
    if (setData.compList.length > 0 && defaultFlag) {
      searchHandler();
    }
  }, [setData.compList, defaultFlag]);

  return (
    <div className={styled.container}>
      <div className={styled.contentArea}>
        <div className={styled.searchArea}>
          <FormSearchBox searchHandler={searchHandler} />
        </div>
        <div className={styled.formListArea}>
          <FormListArea rows={formListData} searchHandler={searchHandler} />
          <FormDetail searchHandler={searchHandler} />
        </div>
      </div>
    </div>
  );
}
