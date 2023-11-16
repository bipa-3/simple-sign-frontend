import React from 'react';
import styles from '../../../styles/components/header/LogoArea.module.css';
import logo from '../../../assets/imgs/logo.png';
import { Navigate, useNavigate } from 'react-router-dom';
import { usePage } from '../../../contexts/PageContext';

function LogoArea() {
  const { state: pageState, setState: setPageState } = usePage();
  const navigate = useNavigate();
  const goHome = function () {
    setPageState((prevState) => ({
      ...prevState,
      curPage: 'Home',
    }));
    navigate('/');
  };
  return (
    <div className={styles.logo_box} onClick={goHome}>
      <div className={styles.logo_icon}>
        {/* <img src={logo} alt="logo" /> */}
        SimpleSign
      </div>
    </div>
  );
}

export default LogoArea;
