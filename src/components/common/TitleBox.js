import React, { useState } from 'react'; // 'react' 패키지에서 useState와 함께 React도 import
import styles from '../../styles/components/common/TitleBox.module.css';
import ViewCount from '../approvalBox/viewDocuments/ViewCount';
import ReloadIcon from '../../assets/imgs/reload.png';
import { useApprovalBox } from '../../contexts/ApprovalBoxContext';

function Titlebox(props) {
  const { state, setState, count } = useApprovalBox();
  const clickReload = () => {
    setState((prevState) => ({
      ...prevState,
      rerender: true,
    }));
  };

  const renderDocCount = () => {
    if (props.view === 'approval') {
      return (
        <div className={styles.showApprobox}>
          <div className={styles.docCount}>
            {props.title === '상신문서' && (
              <div>
                <ViewCount count={count.sendCount}></ViewCount>건
              </div>
            )}
            {props.title === '미결문서' && (
              <div>
                <ViewCount count={count.pendCount}></ViewCount>건
              </div>
            )}
            {props.title === '기결문서' && (
              <div>
                <ViewCount count={count.concludedCount}></ViewCount>건
              </div>
            )}
            {props.title === '수신참조문서' && (
              <div>
                <ViewCount count={count.referenceCount}></ViewCount>건
              </div>
            )}
          </div>
          <img
            className={styles.reloadIcon}
            src={ReloadIcon}
            alt="reload"
            onClick={clickReload}
          />
        </div>
      );
    }
    return null;
  };
  return (
    <div className={styles.titleBoxContainer}>
      <div className={styles.left}>
        <div className={styles.titleSearchBox}>
          <div className={styles.boxtitle}>{props.title}</div>
          {renderDocCount()}
          {/* <img className={styles.reloadIcon} src={ReloadIcon} alt="reload" /> */}
        </div>
      </div>
      <div className={styles.right}>{props.componentProp}</div>
    </div>
  );
}
export default Titlebox;
