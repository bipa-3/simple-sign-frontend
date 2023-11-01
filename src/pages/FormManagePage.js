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
import axiosErrorHandle from '../apis/error/axiosErrorHandle';

export default function FormManagePage() {
  const [formListData, setFormListData] = useState([]);
  const { searchData, setData, setSearchDataById, setSetDataById } =
    useFormManage();
  const { showLoading, hideLoading } = useLoading();
  const { state, setState } = usePage();

  const searchFormData = () => {
    getFormAndCompList(searchData)
      .then((res) => {
        if (!(res.status >= 200 && res.status < 300)) {
          throw new Error(res.status);
        }
        return res.json();
      })
      .then((data) => {
        if (data.length < 0) {
          alert('검색된 데이터가 없습니다.');
        }
        setFormListData(data);
      })
      .catch((err) => {
        setFormListData([]);
      })
      .finally(() => {
        hideLoading();
      });
  };

  const setCompListData = () => {
    getCompanyList()
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (getAuthrity() === '1') {
          data = [{ id: 0, name: '전체' }, ...data];
        }
        setSearchDataById('compId', data[0].id);
        setSetDataById('compList', data);
      })
      .catch((err) => {
        axiosErrorHandle(err);
      })
      .finally(() => {
        hideLoading();
      });
  };

  // 검색 및 테이블 데이터 셋팅
  const searchHandler = () => {
    checkSearchData(searchData)
      .then(() => {
        showLoading();
        searchFormData();
      })
      .catch((errors) => {
        alert(errors.message);
      });
  };

  useEffect(() => {
    //페이지 데이터 셋팅
    setState({ ...state, curPage: '기안양식관리' });

    //회사명, 기본 데이터 셋팅
    setCompListData();

    return () => {
      setSearchDataById('status', 1);
    };
  }, []);

  //기본 항목 검색
  useEffect(() => {
    if (setData.compList.length > 0) {
      searchHandler();
    }
  }, [setData.compList]);

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
