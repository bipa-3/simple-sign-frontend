import React, { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import Userprofile from './Userprofile';
import styles from '../../../styles/components/header/dropdown.module.css';
import AppContext from '../../../contexts/AppContext';
import { postLogout } from '../../../apis/loginAPI/postLogout';
import { useNavigate } from 'react-router';
import Radio from '@mui/material/Radio';
import Button2 from '../../common/Button';
import { getAuthorityCode } from '../../../apis/headerAPI/getAuthorityCode';

export default function Profile() {
  // 로그아웃
  const navigate = useNavigate();
  const { state, setState } = useContext(AppContext);

  // 로컬스토리지에 있는 userOrgList
  const userOrgList = JSON.parse(localStorage.getItem('userOrgList') || '[]');

  // 라디오 버튼
  const [selectedValue, setSelectedValue] = useState(
    localStorage.getItem('orgUSerId') || userOrgList[0].orgUserId
  );

  const hadleChange = (e) => {
    setSelectedValue(e.target.value);
  };

  //로그아웃
  const logout = () => {
    postLogout()
      .then(() => {
        localStorage.clear();
        document.cookie =
          'JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        setState({ ...state, isLoggedIn: false });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 권한
  const authorityCodeAPI = async (orgUserId) => {
    const response = await getAuthorityCode(orgUserId);
    localStorage.setItem('authority', response.data);
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
            <div className={styles.menuitem}>
              <MenuItem
                className={styles.menubox}
                onClick={() => {
                  popupState.close();
                  navigate('/userinfo');
                }}
              >
                Profile
              </MenuItem>
              <MenuItem
                className={styles.menubox}
                onClick={() => {
                  logout();
                }}
              >
                Logout
              </MenuItem>
            </div>
            <div>
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>회사명</th>
                    <th>부서명</th>
                    <th>권한</th>
                  </tr>
                </thead>
                <tbody>
                  {userOrgList.map((item) => (
                    <tr>
                      <td>
                        <Radio
                          checked={selectedValue == item.orgUserId}
                          onChange={hadleChange}
                          value={item.orgUserId}
                          name="radio"
                        />
                      </td>
                      <td>{item.compName}</td>
                      <td>{item.deptName}</td>
                      <td>{item.authorityName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <Button2
                label={'확인'}
                btnStyle={'blue_btn'}
                width={'50px'}
                height={'30px'}
                fontSize={'12px'}
                onClick={() => {
                  authorityCodeAPI(selectedValue);
                  localStorage.setItem('orgUSerId', selectedValue);
                  const selectedItem = userOrgList.find(
                    (item) => item.orgUserId == selectedValue
                  );
                  if (selectedItem) {
                    localStorage.setItem('authority', selectedItem.authority);
                    localStorage.setItem('compId', selectedItem.compId);
                  }
                  popupState.close();
                }}
              />
            </div>
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
}
