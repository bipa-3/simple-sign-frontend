import React, { useEffect, useState } from 'react';
import styled from '../styles/pages/SeqManagePage.module.css';
import SeqDetail from '../components/seqManage/seqDetail/SeqDetail';
import { usePage } from '../contexts/PageContext';
import SeqSearchBox from '../components/seqManage/searchBox/SeqSearchBox';
import SeqListArea from '../components/seqManage/seqList/SeqListArea';
import getCompanyList from '../apis/commonAPI/getCompanyList';
import { useSeqManage } from '../contexts/SeqManageContext';
import getSeqAndCompList from '../apis/commonAPI/getSeqAndCompList';
import { useLoading } from '../contexts/LoadingContext';

export default function SeqManagePage() {
  const { state, setState } = usePage();
  const [formListData, setFormListData] = useState([]);
  const { searchData, setSearchData, setData, setSetData } = useSeqManage();
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    //페이지 데이터 셋팅
    setState({ ...state, curPage: 'SeqManage' });

    //회사명, 기본 데이터 셋팅
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
      });
  }, []);

  useEffect(() => {
    if (setData.compList.length > 0) {
      searchHandler();
    }
  }, [setData.compList]);

  // 검색 및 테이블 데이터 셋팅
  const searchHandler = () => {
    showLoading();
    getSeqAndCompList(searchData)
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
          alert('검색된 채번이 없습니다.');
        }
      })
      .finally(() => {
        hideLoading();
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
