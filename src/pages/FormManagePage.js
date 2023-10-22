import React, { useEffect, useState } from 'react';
import styled from '../styles/pages/FormManagePage.module.css';
import FormSearchBox from '../components/formManage/searchBox/FormSearchBox';
import FormDetail from '../components/formManage/formDetail/FormDetail';
import FormListArea from '../components/formManage/formList/FormListArea';
import getCompanyList from '../apis/commonAPI/getCompanyList';
import getFormAndCompList from '../apis/commonAPI/getFormAndCompList';
import { useFormManage } from '../contexts/FormManageContext';
import { usePage } from '../contexts/PageContext';
import { useLoading } from '../contexts/LoadingContext';
import { checkSearchData } from '../validation/formManage/searchSchema';

export default function FormManagePage() {
  const [formListData, setFormListData] = useState([]);
  const { searchData, setSearchData, setData, setSetData } = useFormManage();
  const { showLoading, hideLoading } = useLoading();
  const { state, setState } = usePage();

  const searchFormData = () => {
    getFormAndCompList(searchData)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res.json();
      })
      .then((data) => {
        setFormListData(data);
      })
      .catch((err) => {
        if (err.message === '404') {
          alert('검색된 양식가 없습니다.');
          setFormListData({});
        }
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
        setSearchData({ ...searchData, compId: data[0].id });
        setSetData({ ...setData, compList: data });
      })
      .catch((err) => {
        console.error(err);
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
    setState({ ...state, curPage: 'FormManage' });

    //회사명, 기본 데이터 셋팅
    setCompListData();
  }, []);

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
