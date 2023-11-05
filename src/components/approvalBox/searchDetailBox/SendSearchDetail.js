import { AiOutlineSearch } from 'react-icons/ai';
import {
  InputComp,
  ItemBox,
  SelectComp,
  TextComp,
} from '../../formManage/searchBox/components/SearchItem';
import SearchDate from '../SearchDate';
import styled from '../../../styles/components/ApprovalBox/SearchDeatil.module.css';
import React, { useEffect } from 'react';
import { useApprovalBox } from '../../../contexts/ApprovalBoxContext';
import Button from '../../common/Button';

function SendSearchDetail(props) {
  const { state, setState, detailSearchState, setDetailSearchState } =
    useApprovalBox();
  const { viewItem } = state;
  const dateName = props.dateName;

  const docStatus = [
    { id: '1', name: '전체', value: '1' },
    { id: '2', name: '상신', value: '2' },
    { id: '3', name: '진행', value: '3' },
    { id: '4', name: '종결', value: '4' },
    { id: '5', name: '반려', value: '5' },
  ];

  const handleSearchIconClick = () => {
    setState((prevState) => ({ ...prevState, shouldFetchDocs: true }));
  };

  const handleDataChange = (key) => (id, value) => {
    setDetailSearchState((prevState) => ({ ...prevState, [key]: value }));
  };
  const handleSelectedData = (id, selectedData) => {
    console.log('select: ', selectedData);
    setDetailSearchState((prevState) => ({
      ...prevState,
      searchApprovState: selectedData,
    }));
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

  useEffect(() => {
    const initialDateOption = docStatus[0];
    if (initialDateOption) {
      setDetailSearchState((prevState) => ({
        ...prevState,
        searchApprovState: initialDateOption.value,
      }));
      setDetailSearchState((prevState) => ({
        ...prevState,
        searchDate: 1,
      }));
    }
  }, [viewItem]);

  return (
    <div className={styled.SearchDetailBox}>
      <div className={styled.searchItems}>
        <div className={styled.searchItem}>
          <ItemBox
            children={
              <>
                <TextComp text={dateName} />
                <SearchDate onDateChange={handleDateChange} />
              </>
            }
          ></ItemBox>
        </div>
        <div className={styled.searchItem}>
          <ItemBox
            children={
              <>
                <TextComp text={'제목'} />
                <InputComp
                  width={'225px'}
                  dataHandler={handleDataChange('searchTitle')}
                />
              </>
            }
          ></ItemBox>
        </div>
        <div className={styled.searchItem}>
          <ItemBox
            children={
              <>
                <TextComp text={'내용'} />
                <InputComp
                  width={'225px'}
                  dataHandler={handleDataChange('searchContent')}
                />
              </>
            }
          ></ItemBox>
        </div>
        <div className={styled.searchItem}>
          <ItemBox
            children={
              <>
                <TextComp text={'결재자'} />
                <InputComp
                  width={'225px'}
                  dataHandler={handleDataChange('searchApprovUser')}
                />
              </>
            }
          ></ItemBox>
        </div>
        <div className={styled.searchItem}>
          <ItemBox
            children={
              <>
                <TextComp text={'결재상태'} />
                <SelectComp
                  options={docStatus}
                  width={'225px'}
                  dataHandler={handleSelectedData}
                />
              </>
            }
          ></ItemBox>
        </div>
        <div className={styled.searchItem}>
          <ItemBox
            children={
              <>
                <TextComp text={'문서양식'} />
                <InputComp
                  width={'225px'}
                  dataHandler={handleDataChange('searchDocForm')}
                />
              </>
            }
          ></ItemBox>
        </div>
        <div className={styled.searchItem}>
          <ItemBox
            children={
              <>
                <TextComp text={'문서번호'} />
                <InputComp
                  width={'225px'}
                  dataHandler={handleDataChange('searchDocNumber')}
                />
              </>
            }
          ></ItemBox>
        </div>
      </div>
      <div className={styled.btnArea}>
        <Button
          label="검색"
          onClick={handleSearchIconClick}
          btnStyle="blue_btn"
        />
      </div>
    </div>
  );
}
export default SendSearchDetail;
