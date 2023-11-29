import styled from '../../styles/components/login/LoginUI.module.css';
import React, { useState, useContext } from 'react';
import { postLogin } from '../../apis/loginAPI/postLogin';
import { useNavigate } from 'react-router';
import AppContext from '../../contexts/AppContext';
import { useAlert } from '../../contexts/AlertContext';

export default function LoginUI() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const { state, setState } = useContext(AppContext);

  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');

  const [err, setErr] = useState({ loginId: null, password: null });

  const onLoginIdChange = (e) => {
    setLoginId(e.target.value);
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  //유효성 검사
  const loginValidate = () => {
    let isLoginVaalid = true;
    const loginValidationErr = {};

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

  const onLoginSubmit = (e) => {
    e.preventDefault();
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
        setLoginId('');
        setPassword('');
        showAlert({
          open: true,
          severity: 'error',
          message: '아이디나 비밀번호를 잘 못 입력하셨습니다.',
        });
      });
  };

  return (
    <>
      <div className={styled.loginContainer}>
        <h2>SimpleSign</h2>
        <form action="/" method="POST" onSubmit={onLoginSubmit}>
          <input
            type="text"
            placeholder={err.loginId ? err.loginId : '아이디'}
            value={loginId}
            onChange={onLoginIdChange}
            className={err.loginId ? styled.login_err_massage : ''}
          />
          <input
            type={err.password ? err.password : 'password'}
            placeholder={err.password ? err.password : '비밀번호'}
            value={password}
            onChange={onPasswordChange}
            className={err.password ? styled.login_err_massage : ''}
          />
          <button
            className={`${styled.btn} ${styled.btnPrimary} ${styled.btnLarge}`}
            type="submit"
          >
            로그인
          </button>
        </form>
      </div>
      <div className={styled.blurContainer}></div>
    </>
  );
}
