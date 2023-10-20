import styled from '../../../styles/pages/ApprovalBoxViewPage.module.css';
import React from 'react';
import TemporSearchDetail from './TemporSearchDetail';
import SendSearchDetail from './SendSearchDetail';
import RemainSearchDetail from './RemainSearchDeatil';
import { useLocation } from 'react-router-dom';
import { useApprovalBox } from '../../../contexts/ApprovalBoxContext';
import { useEffect } from 'react';

function SearchDetailBox() {
  const location = useLocation(); // URL의 위치 정보를 얻음
  const queryParams = new URLSearchParams(location.search);
  const viewItemsString = queryParams.get('viewItems');
  const viewItems = viewItemsString ? viewItemsString.split(',') : [];
  const { setState, detailSearchState, setDetailSearchState } =
    useApprovalBox();

  function setDatename() {
    if (viewItems.includes('send') || viewItems.includes('reference')) {
      return '기안일';
    } else if (viewItems.includes('tempor')) {
      return '작성일';
    } else if (viewItems.includes('pend')) {
      return '도착일';
    } else if (viewItems.includes('concluded')) {
      return '결재일';
    }
  }

  let searchDetailComponent;

  if (viewItems.includes('tempor')) {
    searchDetailComponent = <TemporSearchDetail dateName={setDatename()} />;
  } else if (viewItems.includes('send')) {
    searchDetailComponent = <SendSearchDetail dateName={setDatename()} />;
  } else {
    searchDetailComponent = <RemainSearchDetail dateName={setDatename()} />;
  }

  useEffect(() => {
    setState((prevState) => ({ ...prevState, shouldFetchDocs: false }));
  }, [detailSearchState]);

  return <div className={styled.searchDetail}>{searchDetailComponent}</div>;
}
export default SearchDetailBox;
