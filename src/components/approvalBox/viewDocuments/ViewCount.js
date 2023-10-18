import styles from '../../../styles/components/common/TitleBox.module.css';
import React from 'react';

function ViewCount(props) {
  return <span className={styles.count}>{props.count}</span>;
}
export default ViewCount;
