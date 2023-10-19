import React from 'react';
import styled from '../../../styles/components/ApprovalBox/ViewDocBox.module.css';
import { useApprovalBox } from '../../../contexts/ApprovalBoxContext';
import { useLocation } from 'react-router-dom';
import SelectBox from '../../common/Selectbox';
import { SelectComp } from '../../formManage/searchBox/components/SearchItem';
import { useEffect } from 'react';

const OPTIONS = {
  pend: [
    { name: '기안일', value: '기안일' },
    { name: '도착일', value: '도착일' },
  ],
  concluded: [
    { name: '기안일', value: '기안일' },
    { name: '결재일', value: '결재일' },
    { name: '종결일', value: '종결일' },
  ],
  reference: [
    { name: '기안일', value: '기안일' },
    { name: '도착일', value: '도착일' },
    { name: '종결일', value: '종결일' },
  ],
};

function TableHeader() {
  const { state = { topSelectSortDate: '' }, setState } = useApprovalBox();

  const location = useLocation(); // URL의 위치 정보를 얻음
  const queryParams = new URLSearchParams(location.search);
  const viewItemsString = queryParams.get('viewItems');
  const viewItems = viewItemsString ? viewItemsString.split(',') : [];

  const optionlist = () => {
    for (const option in OPTIONS) {
      if (viewItems.includes(option)) {
        return OPTIONS[option].map((item) => ({
          seqCode: item.value,
          name: item.name,
        }));
      }
    }
    return [];
  };

  const handleSearchDate = (id, selectedDate) => {
    setState((prevState) => ({
      ...prevState,
      selectSortDate: selectedDate,
      bottomSelectSortDate: selectedDate,
    }));
  };

  const setDatename = () => {
    if (viewItems.includes('send')) {
      return '기안일';
    } else if (viewItems.includes('tempor')) {
      return '작성일';
    } else if (viewItems.includes('pend')) {
      return (
        <SelectComp
          dataHandler={handleSearchDate}
          options={optionlist()}
          width="100"
          height="30"
          values={
            state.topSelectSortDate != ''
              ? state.topSelectSortDate
              : state.selectSortDate
          }
        />
      );
    } else if (viewItems.includes('concluded')) {
      return (
        <SelectComp
          dataHandler={handleSearchDate}
          options={optionlist()}
          width="100"
          height="30"
          values={
            state.topSelectSortDate != ''
              ? state.topSelectSortDate
              : state.selectSortDate
          }
        />
      );
    } else if (viewItems.includes('reference')) {
      return (
        <SelectComp
          dataHandler={handleSearchDate}
          options={optionlist()}
          width="100"
          height="30"
          values={
            state.topSelectSortDate != ''
              ? state.topSelectSortDate
              : state.selectSortDate
          }
        />
      );
    }
  };

  useEffect(() => {
    handleSearchDate(null, state.topSelectSortDate);
  }, [state.topSelectSortDate]);

  useEffect(() => {
    handleSearchDate(null, state.selectSortDate);
  }, [state.selectSortDate]);

  return (
    <div className={styled.tableheader}>
      <div className={styled.titleAndcontents}>
        <span className={styled.title1}>{setDatename()}</span>
        <span className={styled.title2}>제목/문서번호</span>
        <span className={styled.title3}>기안자/기안부서</span>
        <span className={styled.title4}>
          {viewItems !== 'tempor' && '결재상태'} {/* 변경된 부분: !== 사용 */}
        </span>
      </div>
    </div>
  );
}
export default TableHeader;
