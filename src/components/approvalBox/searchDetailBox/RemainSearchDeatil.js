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

function RemainSearchDetail() {
  const { state, setState, detailSearchState, setDetailSearchState } =
    useApprovalBox();
  const { viewItem } = state;
  const docStatus = [
    { name: '전체', value: '1' },
    { name: '상신', value: '2' },
    { name: '진행', value: '3' },
    { name: '종결', value: '4' },
    { name: '반려', value: '5' },
  ];
  const OPTIONS = {
    pend: [
      { name: '도착일', value: 'arrivedDate' },
      { name: '기안일', value: 'sendDate' },
    ],
    concluded: [
      { name: '결재일', value: 'approvDate' },
      { name: '기안일', value: 'sendDate' },
      { name: '종결일', value: 'closedDate' },
    ],
    reference: [
      { name: '기안일', value: 'sendDate' },
      { name: '도착일', value: 'arrivedDate' },
      { name: '종결일', value: 'closedDate' },
    ],
  };

  const handleSearchIconClick = () => {
    setState((prevState) => ({ ...prevState, shouldFetchDocs: true }));
  };

  const optionlist = () => {
    for (const option in OPTIONS) {
      if (viewItem.includes(option)) {
        return OPTIONS[option];
      }
    }
    return [];
  };

  useEffect(() => {
    const initialDateOption = optionlist()[0];
    if (initialDateOption) {
      setDetailSearchState((prevState) => ({
        ...prevState,
        searchDate: initialDateOption.value,
      }));
    }
  }, [viewItem]);

  useEffect(() => {
    const initialDateOption = docStatus[0];
    if (initialDateOption) {
      setDetailSearchState((prevState) => ({
        ...prevState,
        searchApprovState: initialDateOption.value,
      }));
    }
  }, [viewItem]);
  const handleSearchDate = (id, selectedDate) => {
    setDetailSearchState((prevState) => ({
      ...prevState,
      searchDate: selectedDate,
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
          <SelectComp
            dataHandler={handleSearchDate}
            options={optionlist()}
            width="65px"
          />
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
