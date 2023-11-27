import styled from '../../styles/components/ApprovalBox/Search.module.css';
import SearchIcon from '@mui/icons-material/Search';
import Button from './Button';
import React, { useState } from 'react';

function Search(props) {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // 폼의 기본 제출 동작 방지
    props.onSearch(searchInput); // 부모 컴포넌트로 searchInput 전달
  };

  return (
    <form onSubmit={handleSearchSubmit} className={styled.searchbox}>
      <input
        id="searchInput"
        type="text"
        placeholder=" 검색"
        value={searchInput}
        onChange={handleSearchChange}
        style={{ width: props.width }}
      />
      <div className={styled.searchBtn}>
        <Button
          label={
            <SearchIcon
              className={styled.searchIcon}
              style={{ fontSize: props.fontSize }}
            />
          }
          btnStyle={'non_btn'}
          width="20px"
        />
      </div>
    </form>
  );
}

export default Search;
