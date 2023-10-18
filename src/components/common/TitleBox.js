import React, { useState } from 'react'; // 'react' 패키지에서 useState와 함께 React도 import
import styles from '../../styles/components/common/TitleBox.module.css';
import ViewCount from '../approvalBox/viewDocuments/ViewCount';
import ReloadIcon from '../../assets/imgs/reload.png';
import { useApprovalBox } from '../../contexts/ApprovalBoxContext';

function Titlebox(props) {
  const { state, setState } = useApprovalBox();
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
            <ViewCount count="5"></ViewCount> 건
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
