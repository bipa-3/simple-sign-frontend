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

      let filteredDocList = docList;

      if (state.radioSortValue === 'ongoingdoc') {
        filteredDocList = docList.filter(
          (docItem) => docItem.docStatus === 'P'
        );
      } else if (state.radioSortValue === 'writtendoc') {
        filteredDocList = docList.filter((docItem) =>
          ['A', 'R'].includes(docItem.docStatus)
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
  }, [pageState.curPage, state.searchInput, page, state.radioSortValue]);

  useEffect(() => {
    if (state.shouldFetchDocs) {
      fetchData(true);
      setState((prevState) => ({ ...prevState, shouldFetchDocs: false }));
    }
  }, [state.shouldFetchDocs]);

  useEffect(() => {
    setPage(1);
  }, [pageState.curPage, state.searchInput]);

  useEffect(() => {
    if (state.rerender) {
      fetchData();
      setState((prevState) => ({ ...prevState, rerender: false }));
    }
  }, [state.rerender]);

  const navigate = useNavigate();

  const handleItemClick = (docId) => {
    navigate(`/AD?page=${docId}`);
  };

  return (
    <div className={styled.container}>
      <TableHeader />
      <div className={styled.docContainer}>
        <div className={styled.docList}>
          {docData.map((docItem) => (
            <DocItem
              key={docItem.approvalDocId}
              docNumber={docItem.approvalDocId}
              formName={docItem.formName}
              date={docItem.createdAt.toLocaleString('ko-KR')}
              title={docItem.approvalDocTitle}
              sendUser={docItem.userName}
              docStatus={docItem.docStatus}
              sendDepartDetail={docItem.deptName}
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
