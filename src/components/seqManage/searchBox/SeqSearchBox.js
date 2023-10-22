import React from 'react';
import styled from '../../../styles/components/formManage/searchBox/SearchBox.module.css';
import InnerBox from '../../common/InnerBox';
import {
  ItemBox,
  TextComp,
  InputComp,
  SelectComp,
} from '../../formManage/searchBox/components/SearchItem';
import { AiOutlineSearch } from 'react-icons/ai';
import { useSeqManage } from '../../../contexts/SeqManageContext';

export default function SeqSearchBox({ searchHandler }) {
  const { searchData, setSearchData, setData } = useSeqManage();

  const dataHandler = (id, data) => {
    setSearchData({ ...searchData, [id]: data });
  };

  const returnContent = () => {
    return (
      <div className={styled.container}>
        <div className={styled.optionsArea}>
          <ItemBox
            children={
              <>
                <TextComp text={'회사'} />
                <SelectComp
                  width={'170px'}
                  options={setData.compList}
                  id={'compId'}
                  dataHandler={dataHandler}
                />
              </>
            }
          ></ItemBox>
          <ItemBox
            children={
              <>
                <TextComp text={'문서채번명'} />
                <InputComp id={'seqName'} dataHandler={dataHandler} />
              </>
            }
          ></ItemBox>
          <ItemBox
            children={
              <>
                <TextComp text={'코드'} />
                <InputComp id={'code'} dataHandler={dataHandler} />
              </>
            }
          ></ItemBox>
        </div>
        <div className={styled.iconArea}>
          <AiOutlineSearch onClick={searchHandler} />
        </div>
      </div>
    );
  };

  return <InnerBox width={'100%'} children={returnContent()}></InnerBox>;
}
