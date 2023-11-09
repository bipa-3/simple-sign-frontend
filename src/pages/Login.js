import React, { useState, useContext } from 'react';
import styled from '../styles/pages/Login.module.css';
import { postLogin } from '../apis/loginAPI/postLogin';
import { useNavigate } from 'react-router';
import AppContext from '../contexts/AppContext';

export default function Login() {
  const navigate = useNavigate();

  const { state, setState } = useContext(AppContext);

  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');

  const [err, setErr] = useState({ loginId: null, password: null });
  const [loginErr, setLoginErr] = useState(null);

  const onLoginIdChange = (e) => {
    setLoginId(e.target.value);
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const hadleKeyEnter = (e) => {
    if (e.keyCode === 13) {
      onLoginSubmit();
    }
  };

  //유효성 검사
  const loginValidate = () => {
    let isLoginVaalid = true;
    const loginValidationErr = {};

    setLoginErr(null);

    if (!loginId) {
      isLoginVaalid = false;
      loginValidationErr.loginId = '아이디를 입력해주세요';
    }

    if (!password) {
      isLoginVaalid = false;
      loginValidationErr.password = '비밀번호를 입력해주세요';
    }

    setErr(loginValidationErr);
    return isLoginVaalid;
  };

  const onLoginSubmit = () => {
    if (!loginValidate()) {
      return;
    }

    postLogin(loginId, password)
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem(
            'orgUserId',
            response.data.userOrgList[0].orgUserId
          );

          localStorage.setItem(
            'authority',
            response.data.userOrgList[0].authorityCode
          );

          localStorage.setItem('compId', response.data.userOrgList[0].compId);
          localStorage.setItem(
            'compName',
            response.data.userOrgList[0].compName
          );

          localStorage.setItem('deptId', response.data.userOrgList[0].deptId);
          localStorage.setItem(
            'deptName',
            response.data.userOrgList[0].deptName
          );

          localStorage.setItem('userId', response.data.userId);
          localStorage.setItem('userName', response.data.userName);

          setState({ ...state, isLoggedIn: true });
          navigate('/');
        }
      })
      .catch((error) => {
        setLoginErr('아이디나 비밀번호를 잘 못 입력하셨습니다.');
        setLoginId('');
        setPassword('');
      });
  };

  return (
    <div className={styled.login_body}>
      <div className={styled.login_page}>
        <div className={styled.login_container}>
          <div className={styled.login_left_box}>
            <div className={styled.login_title}>SimpleSign</div>
            <div className={styled.eula}>
              전자결재
              <br />
              5조
            </div>
          </div>
          <div className={styled.login_right_box}>
            <svg className={styled.login_svg} viewBox="0 0 320 300">
              ...
            </svg>
            <div className={styled.login_form}>
              <div>
                <label className={styled.login_label} htmlFor="login_id">
                  아이디
                </label>
                <input
                  className={styled.login_input}
                  type="text"
                  id="login_id"
                  value={loginId}
                  onChange={onLoginIdChange}
                  onKeyDown={hadleKeyEnter}
                />
                {err.loginId && (
                  <span className={styled.login_err_massage}>
                    {err.loginId}
                  </span>
                )}
                <label className={styled.login_label} htmlFor="password">
                  비밀번호
                </label>
                <input
                  className={styled.login_input}
                  type="password"
                  id="password"
                  value={password}
                  onChange={onPasswordChange}
                  onKeyDown={hadleKeyEnter}
                />
                {err.password && (
                  <span className={styled.login_err_massage}>
                    {err.password}
                  </span>
                )}
              </div>
              {loginErr && (
                <div className={styled.login_err_massage}>{loginErr}</div>
              )}
              <button id={styled.login_button} onClick={onLoginSubmit}>
                로그인
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
