import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ContextProvider from './contexts/ContextProvider';
import HomePage from './pages/HomePage';
import Sidebar from './components/sidebar/Sidebar';
import Header from './components/header/Header';
import FormManagePage from './pages/FormManagePage';

import ApprovalBoxViewPage from './pages/ApprovalBoxViewPage';
import Titlebox from './components/common/TitleBox';
import ApprovalRightHeader from './components/approvalBox/ApprovalRightHeader';
import SeqManagePage from './pages/SeqManagePage';

import FormListPage from './pages/FormListPage';

import AppContext from './contexts/AppContext';
import Login from './pages/Login';
import ApprovalBoxSetPage from './pages/ApprovalBoxSetPage';
import ApprovalUpdatePage from '../src/pages/ApprovalUpdatePage';
import ApprovalDetail from '../src/components/approvalManage/approvalDetail/ApprovalDetail';
import Loading from './components/common/Loading';
import { usePage } from './contexts/PageContext';
import UserInfo from './pages/UserInfo';
import UpdateUserInfo from './pages/UpdateUserInfo';
import checkUserAuthority from './utils/checkUserAuthority';
import { getLoginCheck } from './apis/loginAPI/postLogin';
import { useFormManage } from './contexts/FormManageContext';
import { useSeqManage } from './contexts/SeqManageContext';
import Button from './components/common/Button';

function getCookie(name) {
  const value = ';' + document.cookie;
  const parts = value.split(';' + name + '=');
  return parts.pop().split(';')[0];
}

function AppContent() {
  const { state, setState } = useContext(AppContext);
  const { state: pageState, setState: setPageState } = usePage();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isPopup = queryParams.get('popup') === 'true';
  const getname = queryParams.get('name');
  const { createDetailData: createFormState } = useFormManage();
  const { createDetailData: createSeqState } = useSeqManage();

  let loginValue = getCookie('LOGIN_COOKIE');
  //세션 확인 후 쿠키값 삭제 요청 api
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await getLoginCheck();
        if (response.status === 200) {
          setState({ ...state, isLoggedIn: true });
        }
      } catch (err) {
        document.cookie =
          'LOGIN_COOKIE=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        localStorage.clear();
        setState({ ...state, isLoggedIn: false });
        //setLogin(false);
      }
    };

    checkLoginStatus();
  }, [location.pathname]); //경로가 변경될 때 마다 요청을 보냄

  return (
    <>
      {loginValue || state.isLoggedIn ? ( //로그인이 되었을 때 모든 페이지
        <div className={`App ${isPopup ? 'popup-mode' : ''}`}>
          {!isPopup && <Header />}
          {!isPopup && <Sidebar />}
          <div className="contentContainer">
            <Titlebox
              title={getname}
              view={pageState.isApprovalBox ? 'approval' : ''}
              componentProp={
                <>
                  {pageState.curPage === '기안양식관리' ? (
                    <Button
                      label={'추가'}
                      btnStyle={'gray_btn'}
                      onClick={createFormState}
                    />
                  ) : null}
                  {pageState.curPage === '문서채번관리' ? (
                    <Button
                      label={'추가'}
                      btnStyle={'gray_btn'}
                      onClick={createSeqState}
                    />
                  ) : null}
                  {pageState.isApprovalBox ? <ApprovalRightHeader /> : ''}
                </>
              }
            ></Titlebox>
            <div className="contentsArea">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route
                  path="/EAM"
                  element={checkUserAuthority(2, <FormManagePage />)}
                />
                <Route
                  path="/ABS"
                  element={checkUserAuthority(2, <ApprovalBoxSetPage />)}
                />
                <Route
                  path="/ABV"
                  element={checkUserAuthority(3, <ApprovalBoxViewPage />)}
                />
                <Route
                  path="/SAM"
                  element={checkUserAuthority(2, <SeqManagePage />)}
                />
                <Route
                  path="/FL/:id"
                  element={checkUserAuthority(3, <FormListPage />)}
                />
                <Route
                  path="/FL"
                  element={checkUserAuthority(3, <FormListPage />)}
                />
                <Route
                  path="/AD"
                  element={checkUserAuthority(3, <ApprovalDetail />)}
                />
                <Route
                  path="/ADD"
                  element={checkUserAuthority(3, <ApprovalUpdatePage />)}
                />
                <Route path="/userinfo" element={<UserInfo />} />
                <Route path="/updateuser" element={<UpdateUserInfo />} />
              </Routes>
            </div>
          </div>
        </div>
      ) : (
        //로그인이 되지 않았을 때 로그인 페이지
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<Navigate to="/login" />} />
        </Routes>
      )}
      <Loading />
    </>
  );
}

function App() {
  return (
    <ContextProvider>
      <div className="App">
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </div>
    </ContextProvider>
  );
}

export default App;
