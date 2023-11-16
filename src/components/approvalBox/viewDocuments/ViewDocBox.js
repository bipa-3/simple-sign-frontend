import React, { useEffect, useState, useContext } from 'react';
import Pagination from '@mui/material/Pagination';
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
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const location = useLocation(); // URL의 위치 정보를 얻음
  const queryParams = new URLSearchParams(location.search);
  const viewItemsString = queryParams.get('viewItems');
  const viewItems = viewItemsString ? viewItemsString.split(',') : [];

  const nameString = queryParams.get('name');
  const boxname = nameString ? nameString : '';
  const { state: pageState, setState: setPageState } = usePage();

  const navigate = useNavigate();

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

  const fetchData = async () => {
    showLoading();
    try {
      const offset = (page - 1) * 10;
      const docListPromise = state.shouldFetchDocs
        ? detailSearchDocs(
            viewItems,
            10,
            offset,
            detailSearchState,
            state.sortStatus,
            state.radioSortValue
          )
        : getDocsList(
            viewItems,
            10,
            offset,
            state.searchInput,
            state.sortStatus,
            state.radioSortValue
          );

      const docCountPromise = state.shouldFetchDocs
        ? detailSearchDocsCount(
            viewItems,
            detailSearchState,
            state.radioSortValue
          )
        : getDocsListCount(viewItems, state.searchInput, state.radioSortValue);

      const [docListResponse, docCountResponse] = await Promise.all([
        docListPromise,
        docCountPromise,
      ]);

      setDocData(
        docListResponse.data.map((docItem) => ({
          ...docItem,
          createdAt: new Date(docItem.createdAt),
        }))
      );
      setTotalCount(docCountResponse.data);
      setTotalPages(Math.ceil(docCountResponse.data / 10));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    hideLoading();
  };

  useEffect(() => {
    fetchData();
  }, [
    page,
    state.searchInput,
    state.sortStatus,
    state.radioSortValue,
    state.shouldFetchDocs,
    boxname,
  ]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'approvalState') {
        fetchData();
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
    console.log(state.approvalState);
    if (state.approvalState === 'allapproval') {
      fetchData();
    }
  }, [state.approvalState]);

  useEffect(() => {
    if (state.shouldFetchDocs) {
      fetchData();
    }
  }, [state.shouldFetchDocs]);

  useEffect(() => {
    setPage(1);
  }, [pageState.curPage, state.searchInput, state.radioSortValue]);

  useEffect(() => {
    if (state.rerender) {
      fetchData();
      setState((prevState) => ({ ...prevState, rerender: false }));
    }
  }, [state.rerender]);

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
          </div>
        )}
      </div>
      <div className={styled.pagination}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, newPage) => setPage(newPage)}
        />
      </div>
    </div>
  );
}

export default ViewDocBox;
