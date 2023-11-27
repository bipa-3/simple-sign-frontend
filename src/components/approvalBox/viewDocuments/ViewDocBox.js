import React, { useEffect, useState, useContext } from 'react';
import DocItem from './DocItem';
import { useApprovalBox } from '../../../contexts/ApprovalBoxContext';
import getDocsList, {
  detailSearchDocs,
  detailSearchDocsCount,
  getDocsListCount,
} from '../../../apis/approvalBoxAPI/getDocsList';
import styled from '../../../styles/components/ApprovalBox/ViewDocBox.module.css';
import TableHeader from './TableHeader';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePage } from '../../../contexts/PageContext';
import insertDocView from '../../../apis/approvalBoxAPI/insertDocView';
import { useLoading } from '../../../contexts/LoadingContext';
import { checkDocSearchData } from '../../../validation/ApprovalBoxManage/ApprovalDocSearchSchema';
import { CiFileOff } from 'react-icons/ci';

function ViewDocBox() {
  const { state, setState, detailSearchState } = useApprovalBox();
  const { showLoading, hideLoading } = useLoading();
  const [docData, setDocData] = useState([]);
  const [lastApprovalDate, setLastApprovalDate] = useState(null);
  const [lastDocId, setLastDocId] = useState(null);

  const location = useLocation(); // URL의 위치 정보를 얻음
  const queryParams = new URLSearchParams(location.search);
  const viewItemsString = queryParams.get('viewItems');
  const viewItems = viewItemsString ? viewItemsString.split(',') : [];

  const nameString = queryParams.get('name');
  const boxname = nameString ? nameString : '';
  const [noMoreData, setNoMoreData] = useState(false); //다음 데이터 여부 측정

  function formatDate(dateString) {
    return dateString.replace('T', ' ');
  }

  const handleItemClick = async (docId) => {
    if (viewItems.includes('reference')) {
      try {
        // 클릭된 문서 ID를 state.docView 배열에 추가
        if (!state.docView.includes(docId)) {
          setState((prevState) => ({
            ...prevState,
            docView: [...prevState.docView, docId],
          }));
        }

        await insertDocView(docId);
      } catch (error) {
        console.error('Error inserting document view:', error);
        return;
      }
    }

    const popupOptions = 'width=1200,height=700,left=100,top=100';
    window.open(`/AD?page=${docId}&popup=true`, '_blank', popupOptions);
  };

  const checkForMoreData = async () => {
    try {
      let docListPromise;
      if (state.shouldFetchDocs) {
        docListPromise = detailSearchDocs(
          viewItems,
          10,
          detailSearchState,
          state.sortStatus,
          state.radioSortValue,
          lastApprovalDate, // 조건부 상태 사용
          lastDocId // 조건부 상태 사용
        );
        setState((prevState) => ({ ...prevState, shouldFetchDocs: false }));
      } else {
        docListPromise = getDocsList(
          viewItems,
          10,
          state.searchInput ? state.searchInput : '',
          state.sortStatus,
          state.radioSortValue,
          lastApprovalDate, // 조건부 상태 사용
          lastDocId // 조건부 상태 사용
        );
      }

      const nextDataResponse = await docListPromise;

      if (nextDataResponse.data.length === 0) {
        setNoMoreData(true);
      } else {
        setNoMoreData(false);
      }
    } catch (error) {
      console.error('Error checking for more data:', error);
    }
  };

  const fetchData = async (isInitialLoad = false) => {
    showLoading();
    try {
      let docListResponse;

      if (state.shouldFetchDocs) {
        const response = await detailSearchDocs(
          viewItems,
          10,
          detailSearchState,
          state.sortStatus,
          state.radioSortValue,
          isInitialLoad ? null : lastApprovalDate,
          isInitialLoad ? null : lastDocId
        );

        docListResponse = response;
      } else {
        docListResponse = await getDocsList(
          viewItems,
          10,
          state.searchInput ? state.searchInput : '',
          state.sortStatus,
          state.radioSortValue,
          isInitialLoad ? null : lastApprovalDate,
          isInitialLoad ? null : lastDocId
        );
      }

      // 데이터 업데이트 (첫 페이지 또는 추가 페이지)
      if (isInitialLoad) {
        setDocData(docListResponse.data); // 첫 페이지 데이터로 초기화
      } else {
        setDocData((prevDocs) => [...prevDocs, ...docListResponse.data]); // 기존 데이터에 추가
      }

      if (docListResponse.data.length === 0) {
        setNoMoreData(true);
      } else {
        setNoMoreData(false);
      }

      if (docListResponse.data.length > 0) {
        const formattedData = docListResponse.data.map((doc) => ({
          ...doc,
          sendDate: doc.sendDate ? formatDate(doc.sendDate) : '',
          endDate: doc.endDate ? formatDate(doc.endDate) : '',
          receiveDate: doc.receiveDate ? formatDate(doc.receiveDate) : '',
          approvalDate: doc.approvalDate ? formatDate(doc.approvalDate) : '',
        }));
        setDocData(
          isInitialLoad ? formattedData : [...docData, ...formattedData]
        );

        const lastDoc = formattedData[formattedData.length - 1];
        if (lastDoc) {
          setLastApprovalDate(lastDoc.sendDate);
          setLastDocId(lastDoc.approvalDocId);
        }
      }
      setState((prevState) => ({
        ...prevState,
        checkNextPage: true,
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    hideLoading();
  };

  useEffect(() => {
    // 첫 페이지 데이터 불러오기
    setDocData([]);

    fetchData(true); // 초기 데이터 로드 표시
  }, [
    // 의존성 배열
    boxname,
    state.searchBtnStatus,
    state.sortStatus,
    state.radioSortValue,
  ]);

  useEffect(() => {
    if (state.shouldFetchDocs) {
      setDocData([]);

      fetchData(true);
    }
  }, [
    // 의존성 배열
    state.shouldFetchDocs,
  ]);

  useEffect(() => {
    if (state.checkNextPage) {
      checkForMoreData();
      setState((prevState) => ({
        ...prevState,
        checkNextPage: false,
      }));
    }
  }, [state.checkNextPage]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'approvalState') {
        setDocData([]);

        fetchData(true); // 초기 데이터 로드 표시
        setState((prevState) => ({
          ...prevState,
          approvalState: event.newValue,
        }));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (state.approvalState === 'allapproval') {
      setDocData([]);

      fetchData(true); // 초기 데이터 로드 표시
    }
  }, [state.approvalState]);

  useEffect(() => {
    if (state.rerender) {
      setDocData([]);

      fetchData(true); // 초기 데이터 로드 표시
      setState((prevState) => ({ ...prevState, rerender: false }));
    }
  }, [state.rerender]);

  const handleLoadMore = () => {
    fetchData(); // 추가 데이터 로드 (기본값 false 사용)
  };

  return (
    <div className={styled.container}>
      <TableHeader />
      <div className={styled.docContainer}>
        {docData.length === 0 ? (
          <div className={styled.noDocumentsContainer}>
            <div className={styled.noDocumentsIcon}>
              <CiFileOff />
            </div>
            <div className={styled.noDocuments}>조회된 데이터가 없습니다.</div>
          </div>
        ) : (
          <div className={styled.docList}>
            {docData
              .filter(
                (docItem) =>
                  !(state.selectSortDate === 4 && docItem.endDate === null)
              )
              .map((docItem) => (
                <DocItem
                  key={docItem.approvalDocId}
                  docNumber={docItem.approvalDocId}
                  formName={docItem.formName}
                  date={
                    state.selectSortDate === 1
                      ? docItem.sendDate
                      : state.selectSortDate === 2 &&
                        viewItems.includes('reference')
                      ? docItem.sendDate
                      : state.selectSortDate === 2
                      ? docItem.receiveDate
                      : state.selectSortDate === 4
                      ? docItem.endDate
                      : state.selectSortDate === 3
                      ? docItem.approvalDate
                      : docItem.sendDate // 기본값을 기안일로 설정했습니다.
                  }
                  title={docItem.approvalDocTitle}
                  sendUser={docItem.userName}
                  docStatus={docItem.docStatus}
                  sendDepartDetail={docItem.deptName}
                  lastUser={
                    docItem.docStatus === 'A' ||
                    docItem.docStatus === 'R' ||
                    docItem.docStatus === 'P'
                      ? docItem.lastUser
                      : docItem.docStatus === 'W'
                      ? docItem.userName
                      : ''
                  }
                  isRead={
                    viewItems.includes('reference') &&
                    state.docView.includes(docItem.approvalDocId)
                  }
                  onClick={() => handleItemClick(docItem.approvalDocId)}
                />
              ))}
            {!noMoreData && ( // 조건부 렌더링
              <button onClick={handleLoadMore}>+ 더 보기</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewDocBox;
