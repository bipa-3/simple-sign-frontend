import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import Userprofile from './Userprofile';
import styles from '../../../styles/components/header/dropdown.module.css';
import AppContext from '../../../contexts/AppContext';
import { postLogout } from '../../../apis/loginAPI/postLogout';
import { useNavigate } from 'react-router';

export default function Profile() {
  const navigate = useNavigate();
  const { state, setState } = useContext(AppContext);

  //로그아웃
  const logout = () => {
    postLogout()
      .then(() => {
        localStorage.clear();
        setState({ ...state, isLoggedIn: false });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment>
          <Button
            variant="contained"
            {...bindTrigger(popupState)}
            className={styles.test}
          >
            <Userprofile />
          </Button>
          <Menu {...bindMenu(popupState)}>
            <div className={styles.fixedbox}>Welcome !</div>
            <MenuItem
              className={styles.menubox}
              onClick={() => {
                popupState.close();
                navigate('/userinfo');
              }}
            >
              Profile
            </MenuItem>
            <MenuItem className={styles.menubox} onClick={popupState.close}>
              My account
            </MenuItem>
            <MenuItem
              className={styles.menubox}
              onClick={() => {
                logout();
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
}
