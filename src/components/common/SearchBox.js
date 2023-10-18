import styled from '../../styles/components/ApprovalBox/Search.module.css';
import SearchIcon from '@mui/icons-material/Search';
import React from 'react';

function Search(props) {
  const searchbtnhandle = () => {
    const searchItem = document.getElementById('searchInput').value.trim();
    props.onSearch(searchItem); //부모 컴포넌트로 searchItem 전달
  };

  return (
    <div className={styled.searchbox}>
      <input id="searchInput" type="text" placeholder=" Search..." />
      <SearchIcon
        style={{ fontSize: props.fontSize }}
        onClick={searchbtnhandle}
      />
    </div>
  );
}

export default Search;
