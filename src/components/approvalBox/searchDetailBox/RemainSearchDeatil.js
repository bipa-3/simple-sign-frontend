import { AiOutlineSearch } from 'react-icons/ai';
import React, { useEffect } from 'react';
import {
  InputComp,
  ItemBox,
  SelectComp,
  TextComp,
} from '../../formManage/searchBox/components/SearchItem';
import SearchDate from '../SearchDate';
import styled from '../../../styles/components/ApprovalBox/SearchDeatil.module.css';
import { useApprovalBox } from '../../../contexts/ApprovalBoxContext';
import Button from '../../common/Button';
import { useLocation } from 'react-router-dom';

function RemainSearchDetail() {
  const { state, setState, detailSearchState, setDetailSearchState } =
    useApprovalBox();
  const location = useLocation(); // URL의 위치 정보를 얻음
  const queryParams = new URLSearchParams(location.search);
  const viewItemsString = queryParams.get('viewItems');
  const viewItems = viewItemsString ? viewItemsString.split(',') : [];

  const docStatus = [
    { id: '1', name: '전체', value: '1' },
    { id: '2', name: '상신', value: '2' },
    { id: '3', name: '진행', value: '3' },
    { id: '4', name: '종결', value: '4' },
    { id: '5', name: '반려', value: '5' },
  ];
  const OPTIONS = {
    pend: [
      { id: '기안일', name: '기안일', value: 1 },
      { id: '도착일', name: '도착일', value: 2 },
    ],
    concluded: [
      { id: '기안일', name: '기안일', value: 1 },
      { id: '결재일', name: '결재일', value: 3 },
      { id: '종결일', name: '종결일', value: 4 },
    ],
    progress: [
      { id: '기안일', name: '기안일', value: 1 },
      { id: '결재일', name: '결재일', value: 3 },
    ],
    end: [
      { id: '기안일', name: '기안일', value: 1 },
      { id: '결재일', name: '결재일', value: 3 },
      { id: '종결일', name: '종결일', value: 4 },
    ],
    reference: [
      { id: '기안일', name: '기안일', value: 1 },
      { id: '도착일', name: '도착일', value: 2 },
      { id: '종결일', name: '종결일', value: 4 },
    ],
  };

  useEffect(() => {
    handleSearchDate(null, state.bottomSelectSortDate);
  }, [state.bottomSelectSortDate]);

  const handleSearchIconClick = () => {
    setState((prevState) => ({ ...prevState, shouldFetchDocs: true }));
  };

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

  const setDatename = () => {
    if (
      viewItems.includes('pend') ||
      viewItems.includes('progress') ||
      viewItems.includes('concluded') ||
      viewItems.includes('reference') ||
      viewItems.includes('end')
    ) {
      return (
        <SelectComp
          dataHandler={handleSearchDate}
          options={optionlist()}
          width="64px"
          height="30px"
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
    const initialDateOption = optionlist()[0];
    if (initialDateOption) {
      setDetailSearchState((prevState) => ({
        ...prevState,
        searchDate: initialDateOption.value,
      }));
    }
  }, []);

  const handleSearchDate = (id, selectedDate) => {
    setState((prevState) => ({
      ...prevState,
      topSelectSortDate: selectedDate,
      selectSortDate: selectedDate,
    }));
  };
  const handleSelectedData = (id, selectedData) => {
    setDetailSearchState((prevState) => ({
      ...prevState,
      searchApprovState: selectedData,
    }));
  };

  const handleDataChange = (key) => (id, value) => {
    setDetailSearchState((prevState) => ({ ...prevState, [key]: value }));
  };

  const handleDateChange = (start, end) => {
    if (end) {
      end.setHours(23, 59, 59, 999); // 시, 분, 초, 밀리초 설정
    }

    setDetailSearchState((prevState) => ({
      ...prevState,
      startDate: start,
      endDate: end,
    }));
  };

  return (
    <div className={styled.SearchDetailBox}>
      <div className={styled.searchItems}>
        <ItemBox>
          {<span>{setDatename()}</span>}
          <SearchDate onDateChange={handleDateChange} />
        </ItemBox>

        <ItemBox>
          <TextComp text={'제목'} />
          <InputComp
            width={'225px'}
            dataHandler={handleDataChange('searchTitle')}
          />
        </ItemBox>

        <ItemBox>
          <TextComp text={'내용'} />
          <InputComp
            width={'225px'}
            dataHandler={handleDataChange('searchContent')}
          />
        </ItemBox>

        <ItemBox>
          <TextComp text={'기안부서'} />
          <InputComp
            width={'225px'}
            dataHandler={handleDataChange('searchDept')}
          />
        </ItemBox>

        <ItemBox>
          <TextComp text={'기안자'} />
          <InputComp
            width={'225px'}
            dataHandler={handleDataChange('searchWriter')}
          />
        </ItemBox>

        <ItemBox>
          <TextComp text={'결재자'} />
          <InputComp
            width={'225px'}
            dataHandler={handleDataChange('searchApprovUser')}
          />
        </ItemBox>

        <ItemBox>
          <TextComp text={'결재상태'} />
          <SelectComp
            options={docStatus}
            width={'225px'}
            dataHandler={handleSelectedData}
          />
        </ItemBox>

        <ItemBox>
          <TextComp text={'문서양식'} />
          <InputComp
            width={'225px'}
            dataHandler={handleDataChange('searchDocForm')}
          />
        </ItemBox>

        <ItemBox>
          <TextComp text={'문서번호'} />
          <InputComp
            width={'225px'}
            dataHandler={handleDataChange('searchDocNumber')}
          />
        </ItemBox>
      </div>
      <div className={styled.btnArea}>
        <Button
          label="조회하기"
          onClick={handleSearchIconClick}
          btnStyle="blue_btn"
        />
      </div>
    </div>
  );
}

export default RemainSearchDetail;
