import React, { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import Userprofile from './Userprofile';
import styles from '../../../styles/components/header/dropdown.module.css';
import AppContext from '../../../contexts/AppContext';
import { postLogout } from '../../../apis/loginAPI/postLogout';
import { useNavigate } from 'react-router-dom';
import Radio from '@mui/material/Radio';
import Button2 from '../../common/Button';
import { getAuthorityCode } from '../../../apis/headerAPI/getAuthorityCode';
import { getUserAuthority } from '../../../apis/headerAPI/getUserAuthority';

export default function Profile() {
  // 로그아웃
  const navigate = useNavigate();
  const { state, setState } = useContext(AppContext);

  // 라디오 버튼
  const [selectedValue, setSelectedValue] = useState(
    localStorage.getItem('orgUserId')
  );

  const hadleChange = (e) => {
    setSelectedValue(e.target.value);
  };

  // 권한을 선택 창 데이터
  const [userOrgList, setUserOrgList] = useState([]);

  //로그아웃
  const logout = () => {
    postLogout()
      .then(() => {
        localStorage.clear();
        document.cookie =
          'LOGIN_COOKIE=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        setState({ ...state, isLoggedIn: false });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 권한을 선택할 수 있는 창
  useEffect(() => {
    getUserAuthority()
      .then((response) => {
        setUserOrgList(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // 권한
  const authorityCodeAPI = async (orgUserId) => {
    const response = await getAuthorityCode(orgUserId);
    localStorage.setItem('orgUserId', response.data.orgUserId);
    localStorage.setItem('compId', response.data.compId);
    localStorage.setItem('compName', response.data.compName);
    localStorage.setItem('deptId', response.data.deptId);
    localStorage.setItem('deptName', response.data.deptName);
    localStorage.setItem('authority', response.data.authorityCode);
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
                  navigate(`/userinfo?name=${'개인정보 조회'}`);
                }}
              >
                개인정보 조회
              </MenuItem>
              <MenuItem
                className={styles.menubox}
                onClick={() => {
                  logout();
                }}
              >
                로그아웃
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
                  {userOrgList.length > 0
                    ? userOrgList.map((item) => (
                        <tr key={item.orgUserId}>
                          <td>
                            <Radio
                              checked={selectedValue == item.orgUserId}
                              onChange={hadleChange}
                              value={item.orgUserId}
                              name="radio"
                            />
                          </td>
                          <td className={styles.table_td}>{item.compName}</td>
                          <td className={styles.table_td}>{item.deptName}</td>
                          <td className={styles.table_td}>
                            {item.authorityName}
                          </td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table>
            </div>
            <div className={styles.button_check_style}>
              <Button2
                label={'확인'}
                btnStyle={'blue_btn'}
                width={'50px'}
                height={'30px'}
                fontSize={'12px'}
                onClick={async () => {
                  try {
                    await authorityCodeAPI(selectedValue);
                    window.location.reload();
                  } catch (error) {
                    console.error(error);
                  }
                }}
              />
            </div>
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
}
