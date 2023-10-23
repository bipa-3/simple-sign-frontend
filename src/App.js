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

function AppContent() {
  const { state } = useContext(AppContext);
  const navigate = useNavigate();
  const { state: pageState, setState: setPageState } = usePage();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const getname = queryParams.get('name');

  //로그인이 되지 않으면 로그인 페이지로
  useEffect(() => {
    if (!state.isLoggedIn) {
      navigate('/login');
    }
  }, [state.isLoggedIn, navigate]);

  return (
    <>
      {state.isLoggedIn ? ( //로그인이 되었을 때 모든 페이지
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
