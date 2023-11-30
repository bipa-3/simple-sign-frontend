import React from 'react';
import styled from '../../../styles/components/formManage/searchBox/SearchBox.module.css';
import InnerBox from '../../common/InnerBox';
import { AiOutlineSearch } from 'react-icons/ai';
import SearchCompBox from './components/SearchCompBox';
import SearchStatusBox from './components/SearchStatusBox';
import SearchFormBox from './components/SearchFormBox';

export default function FormSearchBox({ searchHandler }) {
  const returnContent = () => {
    return (
      <div className={styled.container}>
        <div className={styled.optionsArea}>
          <SearchCompBox />
          <SearchStatusBox />
          <SearchFormBox searchHandler={searchHandler} />
        </div>
        <div className={styled.iconArea}>
          <AiOutlineSearch onClick={searchHandler} />
        </div>
      </div>
    );
  };

  return <InnerBox width={'100%'} children={returnContent()}></InnerBox>;
}
