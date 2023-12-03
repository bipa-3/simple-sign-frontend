import styles from '../../styles/components/ApprovalBox/ApprovalRightHeader.module.css';
import React, { useContext, useEffect, useState } from 'react';
import { useApprovalBox } from '../../contexts/ApprovalBoxContext';
import Search from '../common/SearchBox';
import Button from '../common/Button';
import { usePage } from '../../contexts/PageContext';
import { useLoading } from '../../contexts/LoadingContext';
import insertApprovalAll from '../../apis/approvalManageAPI/insertApprovalAll';
import ErrorHandle from '../../apis/errorHandle';

function ApprovalRightHeader() {
  const [isDropdownView, setDropdownView] = useState(false);
  const { state, setState } = useApprovalBox();
  const { state: pageState, setState: setPageState } = usePage();
  const { showLoading, hideLoading } = useLoading();

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
      showCount: true,
    }));
  };

  const handleApproval = () => {
    showLoading();

    insertApprovalAll()
      .then((res) => {
        if (res.status === 200) {
          alert('일괄결재 완료되었습니다.');
          setState((prevState) => ({
            ...prevState,
            approvalState: 'allapproval',
          }));
        } else {
          ErrorHandle(res);
        }
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        hideLoading();
      });
  };

  return (
    <div className={styles.list}>
      <div className={styles.allApprovalBtn}>
        {pageState.curPage === '미결문서' ? (
          <Button
            label={'일괄결재'}
            btnStyle={'red_btn'}
            onClick={handleApproval}
          />
        ) : null}
      </div>
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
