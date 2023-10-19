import React, { useEffect, useState, useContext } from 'react';
import Pagination from '@mui/material/Pagination';
import DocItem from './DocItem';
import { useApprovalBox } from '../../../contexts/ApprovalBoxContext';
import getDocsList, {
  detailSearchDocs,
} from '../../../apis/approvalBoxAPI/getDocsList';
import styled from '../../../styles/components/ApprovalBox/ViewDocBox.module.css';
import TableHeader from './TableHeader';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePage } from '../../../contexts/PageContext';
import insertDocView from '../../../apis/approvalBoxAPI/insertDocView';

function ViewDocBox() {
  const { state, setState, detailSearchState } = useApprovalBox();
  const [docData, setDocData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const location = useLocation(); // URL의 위치 정보를 얻음
  const queryParams = new URLSearchParams(location.search);
  const viewItemsString = queryParams.get('viewItems');
  const viewItems = viewItemsString ? viewItemsString.split(',') : [];
  const { state: pageState, setState: setPageState } = usePage();

  const fetchData = async (isDetailSearch = false) => {
    try {
      const offset = (page - 1) * 10;
      const response = isDetailSearch
        ? await detailSearchDocs(viewItems, 10, offset, detailSearchState)
        : await getDocsList(viewItems, 10, offset, state.searchInput);

      const { docList, count } = response.data;

      //조회 필터링
      let filteredDocList = docList;

      if (state.radioSortValue === 'ongoingdoc') {
        filteredDocList = docList.filter(
          (docItem) => docItem.docStatus === 'P'
        );
      } else if (state.radioSortValue === 'writtendoc') {
        filteredDocList = docList.filter((docItem) =>
          ['A', 'R'].includes(docItem.docStatus)
        );
      } else if (
        state.radioSortValue === 'readdoc' &&
        viewItems.includes('reference')
      ) {
        filteredDocList = docList.filter((docItem) =>
          state.docView.includes(docItem.approvalDocId)
        );
      } else if (
        state.radioSortValue === 'notreaddoc' &&
        viewItems.includes('reference')
      ) {
        filteredDocList = docList.filter(
          (docItem) => !state.docView.includes(docItem.approvalDocId)
        );
      }

      setDocData(
        filteredDocList.map((docItem) => ({
          ...docItem,
          createdAt: new Date(docItem.createdAt),
        }))
      );

      setTotalCount(count);
      setTotalPages(Math.ceil(count / 10));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    pageState.curPage,
    state.searchInput,
    page,
    state.radioSortValue,
    state.isReadDoc,
  ]);

  useEffect(() => {
    if (state.shouldFetchDocs) {
      fetchData(true);
      setState((prevState) => ({ ...prevState, shouldFetchDocs: false }));
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

  const navigate = useNavigate();

  const handleItemClick = async (docId) => {
    setState((prevState) => ({ ...prevState, isReadDoc: docId }));
    navigate(`/AD?page=${docId}`);
    if (viewItems.includes('reference')) {
      try {
        //클릭된 문서 ID를 state.docView 배열에 추가
        if (!state.docView.includes(docId)) {
          setState((prevState) => ({
            ...prevState,
            docView: [...prevState.docView, docId],
          }));
        }

        await insertDocView(docId);
      } catch (error) {
        console.error('Error inserting document view:', error);
      }
    }
  };

  return (
    <div className={styled.container}>
      <TableHeader />
      <div className={styled.docContainer}>
        <div className={styled.docList}>
          {docData
            .filter(
              (docItem) =>
                !(state.selectSortDate === '종결일' && docItem.endDate === null)
            )
            .map((docItem) => (
              <DocItem
                key={docItem.approvalDocId}
                docNumber={docItem.approvalDocId}
                formName={docItem.formName}
                date={
                  state.selectSortDate === '기안일'
                    ? docItem.sendDate
                    : state.selectSortDate === '도착일' &&
                      viewItems.includes('reference')
                    ? docItem.sendDate
                    : state.selectSortDate === '도착일'
                    ? docItem.receiveDate
                    : state.selectSortDate === '종결일'
                    ? docItem.endDate
                    : state.selectSortDate === '결재일'
                    ? docItem.approvalDate
                    : docItem.sendDate // 기본값을 기안일로 설정했습니다.
                }
                title={docItem.approvalDocTitle}
                sendUser={docItem.userName}
                docStatus={docItem.docStatus}
                sendDepartDetail={docItem.deptName}
                lastUser={
                  docItem.docStatus === 'A' || docItem.docStatus === 'R'
                    ? docItem.endUser
                    : docItem.docStatus === 'W'
                    ? docItem.userName
                    : docItem.docStatus === 'P'
                    ? docItem.approver
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
