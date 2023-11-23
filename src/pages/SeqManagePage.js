import React, { useEffect, useState } from 'react';
import styled from '../styles/pages/SeqManagePage.module.css';
import SeqDetail from '../components/seqManage/seqDetail/SeqDetail';
import { usePage } from '../contexts/PageContext';
import SeqSearchBox from '../components/seqManage/searchBox/SeqSearchBox';
import SeqListArea from '../components/seqManage/seqList/SeqListArea';
import getCompanyList from '../apis/commonAPI/getCompanyList';
import { useSeqManage } from '../contexts/SeqManageContext';
import getSeqAndCompList from '../apis/seqManageAPI/getSeqAndCompList';
import { useLoading } from '../contexts/LoadingContext';
import { checkSearchData } from '../validation/seqManage/searchSchema';
import { getAuthrity } from '../utils/getUser';
import { useAlert } from '../contexts/AlertContext';

export default function SeqManagePage() {
  const { state, setState } = usePage();
  const [formListData, setFormListData] = useState([]);
  const { searchData, setSearchData, setData, setSetData } = useSeqManage();
  const { showLoading, hideLoading } = useLoading();
  const { showAlert } = useAlert();

  const setCompListData = () => {
    getCompanyList()
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (getAuthrity() === '1') {
          data = [{ id: 0, name: '전체' }, ...data];
        }
        setSearchData({ ...searchData, compId: data[0].id });
        setSetData({ ...setData, compList: data });
      })
      .catch((err) => {
        showAlert({
          severity: 'error',
          message: `기본 데이터 조회에 실패했습니다. [${err}]`,
        });
      });
  };

  const searchSeqListData = () => {
    getSeqAndCompList(searchData)
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
            message: `조회된 채번목록이 없습니다.`,
          });
        }
        setFormListData(data);
      })
      .catch((err) => {
        showAlert({
          severity: 'error',
          message: `채번 조회에 실패했습니다. [${err}]`,
        });
      })
      .finally(() => {
        hideLoading();
      });
  };

  useEffect(() => {
    //페이지 데이터 셋팅
    setState({ ...state, curPage: '문서채번관리' });

    //회사명, 기본 데이터 셋팅
    setCompListData();
  }, []);

  useEffect(() => {
    if (setData.compList.length > 0) {
      searchHandler();
    }
  }, [setData.compList]);

  // 검색 및 테이블 데이터 셋팅
  const searchHandler = () => {
    checkSearchData(searchData)
      .then(() => {
        showLoading();
        searchSeqListData();
      })
      .catch((err) => {
        showAlert({
          severity: 'info',
          message: `채번목록 조회에 실패했습니다. [${err}]`,
        });
      });
  };

  return (
    <div className={styled.container}>
      <div className={styled.contentArea}>
        <div className={styled.searchArea}>
          <SeqSearchBox searchHandler={searchHandler} />
        </div>
        <div className={styled.formListArea}>
          <SeqListArea rows={formListData} searchHandler={searchHandler} />
          <SeqDetail searchHandler={searchHandler} />
        </div>
      </div>
    </div>
  );
}
