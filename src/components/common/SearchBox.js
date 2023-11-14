import styled from '../../styles/components/ApprovalBox/Search.module.css';
import SearchIcon from '@mui/icons-material/Search';
import Button from './Button';
import React, { useState } from 'react';

function Search(props) {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };
  const searchbtnhandle = () => {
    props.onSearch(searchInput); //부모 컴포넌트로 searchItem 전달
  };

  return (
    <div className={styled.searchbox}>
      <input
        id="searchInput"
        type="text"
        placeholder=" 검색"
        value={searchInput}
        onChange={handleSearchChange}
      />
      <Button
        label={
          <SearchIcon
            className={styled.searchIcon}
            style={{ fontSize: props.fontSize }}
          />
        }
        onClick={searchbtnhandle}
        btnStyle={'non_btn'}
      />
    </div>
  );
}

export default Search;
