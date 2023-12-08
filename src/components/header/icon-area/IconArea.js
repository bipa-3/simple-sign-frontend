import styles from '../../../styles/components/header/iconArea.module.css';
import ProfileDrop from './ProfileDrop';
import NoticeDrop from './NoticeDrop';
import React, { useState } from 'react';

function IconArea() {
  const [stompClient, setStompClient] = useState(null);
  const handleStompClientChange = (client) => {
    setStompClient(client);
  };

  return (
    <div className={styles.icon_box}>
      <ul className={styles.iconlist}>
        <NoticeDrop onStompClient={handleStompClientChange} />
        <ProfileDrop stompClient={stompClient} />
      </ul>
    </div>
  );
}

export default IconArea;
