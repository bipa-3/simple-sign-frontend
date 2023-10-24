import React, { useContext, useEffect } from 'react';
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

function getCookie(name) {
  const value = ';' + document.cookie;
  const parts = value.split(';' + name + '=');
  return parts.pop().split(';')[0];
}

function AppContent() {
  const { state, setState } = useContext(AppContext);
  const navigate = useNavigate();
  const { state: pageState, setState: setPageState } = usePage();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const getname = queryParams.get('name');

  useEffect(() => {
    // 1. 초기 로딩 시 쿠키를 확인하여 초기 상태를 설정
    const isLoggedIn = getCookie('LOGIN_COOKIE') === 'true';
    setState({ isLoggedIn });
  }, []);

  // 다시 로딩 시에도 쿠키를 확인하여 로그인 상태를 유지하거나 다시 설정
  useEffect(() => {
    const isLoggedIn = getCookie('LOGIN_COOKIE') === 'true';
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [document.cookie]);

  return (
    <>
      <>
        {state.isLoggedIn ? (
          <>
            <Header />
            <Sidebar />
            <div className="contentContainer">
              <Titlebox
                title={getname}
                view={pageState.isApprovalBox ? 'approval' : ''}
                componentProp={
                  pageState.isApprovalBox ? <ApprovalRightHeader /> : ''
                }
              ></Titlebox>
              <div className="contentsArea">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route
                    path="/EAM"
                    element={checkUserAuthority(2, <FormManagePage />)}
                  />
                  <Route path="/ABS" element={<ApprovalBoxSetPage />} />
                  <Route path="/ABV" element={<ApprovalBoxViewPage />} />
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
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
        )}
      </>

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
