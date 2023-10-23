import styles from '../../../styles/components/header/userProfile.module.css';
import React, { useState, useEffect } from 'react';
import { getProfile } from '../../../apis/userInfoAPl/getProfile';

function Userprofile() {
  const [view, setView] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfile()
      .then((response) => {
        setProfile(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className={styles.profile}>
      <div
        className={styles.dropdown}
        onClick={() => {
          setView(!view);
        }}
      >
        <div className={styles.list_user}>
          <img
            src={profile}
            className={styles.rounded_circle}
            alt="userphoto"
          />
          <div className={styles.profile_userbox}>
            <span className={styles.userbox_username}>
              {localStorage.getItem('userName')}
            </span>
            <span className={styles.userbox_userdepart}>
              {localStorage.getItem('compName')} -{' '}
              {localStorage.getItem('deptName')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Userprofile;
