import styles from '../../styles/components/ApprovalBox/ApprovalRightHeader.module.css';
import React, { useContext, useState } from 'react';
import { useApprovalBox } from '../../contexts/ApprovalBoxContext';
import Search from '../common/SearchBox';

function ApprovalRightHeader() {
  const [isDropdownView, setDropdownView] = useState(false);
  const { state, setState } = useApprovalBox();

  const { detailSearchState, setDetailSearchState, detailSearchInitState } =
    useApprovalBox();

  const handleClickContainer = () => {
    setDropdownView(!isDropdownView);
    setState((prevState) => ({
      ...prevState,
      view: !prevState.view,
    }));
    setDetailSearchState(detailSearchInitState);
  };

  const handleBlurContainer = () => {
    setTimeout(() => {
      setDropdownView(false);
    }, 200);
  };

  const handleSearch = (value) => {
    setState((prevState) => ({
      ...prevState,
      searchInput: value,
      searchBtnStatus: !prevState.searchBtnStatus,
    }));
  };

  return (
    <div className={styles.list}>
      <Search onSearch={handleSearch} fontSize="17px" />
      <div className={styles.container} onBlur={handleBlurContainer}>
        <label onClick={handleClickContainer}>
          <button className={styles.dropdownBtn}>
            {isDropdownView ? '▲' : '▼'}
          </button>
        </label>
      </div>
    </div>
  );
}
export default ApprovalRightHeader;
