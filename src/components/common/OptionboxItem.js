import { IoMdClose } from 'react-icons/io'; // IoMdClose 아이콘을 명시적으로 가져옵니다.
import styles from '../../styles/components/common/Optionbox.module.css';
import React from 'react';

function OptionboxItem(props) {
  //console.log(props);
  return (
    <div className={styles.whole}>
      <div className={styles.element}>
        <div className={styles.iconimg}>{props.icon}</div>
        <div className={styles.text}>
          <a>{props.name}</a>
        </div>
        <div
          className={styles.iconX}
          onClick={() => {
            props.onValueChange(props.id, props.category, props.useId);
          }}
        >
          <IoMdClose />
        </div>
      </div>
    </div>
  );
}

export default OptionboxItem;
