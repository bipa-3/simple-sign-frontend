import React, { useContext } from 'react';
import RowRadioButtonsGroup from '../components/approvalBox/RowRadioButtonsGroup';
import SearchDetailBox from '../components/approvalBox/searchDetailBox/SearchDetailBox';
import InnerBox from '../components/common/InnerBox';
import styles from '../styles/pages/ApprovalBoxViewPage.module.css';
import ViewDocBox from '../components/approvalBox/viewDocuments/ViewDocBox';
import { useApprovalBox } from '../contexts/ApprovalBoxContext';

function ApprovalBoxViewPage() {
  const { state, setState } = useApprovalBox();

  return (
    <div className={styles.container}>
      {state.view && (
        <InnerBox>
          <div className={styles.searchDetailbox}>
            <SearchDetailBox />
          </div>
        </InnerBox>
      )}
      <div className={styles.originArea}>
        <InnerBox
          height={'100%'}
          width={'100%'}
          childStyle={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div className={styles.radiobuttonsBox}>
            <div className={styles.radiogroup}>
              <RowRadioButtonsGroup></RowRadioButtonsGroup>
            </div>
          </div>
          <ViewDocBox></ViewDocBox>
        </InnerBox>
      </div>
    </div>
  );
}
export default ApprovalBoxViewPage;
