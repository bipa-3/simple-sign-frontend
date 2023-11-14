import React, { createContext, useState, useContext } from 'react';

const initialState = {
  boxId: null,
  insertStatus: 0,
  compId: null,
  count: 0,
  saveStatus: false,
  boxList: [],
};

const approvalBoxInit = {
  approvalBoxId: '',
  compId: '',
  approvalBoxName: '',
  viewItems: [],
  approvalBoxUsedStatus: 1,
  menuUsingRange: 'T',
  boxUseDept: [],
  sortOrder: 0,
};

const approvalBoxInit2 = {
  approvalBoxId: '',
  compId: '',
  approvalBoxName: '',
  viewItems: [],
  approvalBoxUsedStatus: 1,
  menuUsingRange: 'T',
  boxUseDept: [],
  sortOrder: 0,
};

const detailInitState = {
  scope: [],
  scope2: [],
};

const initData = {
  name: [],
  user: '',
  userId: '',
  department: '',
  deptId: '',
  establishment: '',
  estId: '',
  company: '',
  compId: '',
  category: null,
};

const ApprovalBoxManageContext = createContext();

export const ApprovalBoxManageProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  const [approvalBoxState, setApprovalBoxState] = useState(approvalBoxInit);
  const [approvalBoxState2, setApprovalBoxState2] = useState(approvalBoxInit2);
  const [initDataState, setInitDataState] = useState(initData);
  const [detailData, setDetailData] = useState(detailInitState);

  return (
    <ApprovalBoxManageContext.Provider
      value={{
        state,
        setState,
        approvalBoxState,
        setApprovalBoxState,
        approvalBoxState2,
        setApprovalBoxState2,
        approvalBoxInit,
        initDataState,
        setInitDataState,
        initData,
        detailData,
        setDetailData,
      }}
    >
      {children}
    </ApprovalBoxManageContext.Provider>
  );
};

export const useApprovalBoxManage = () => {
  const context = useContext(ApprovalBoxManageContext);
  if (!context) {
    throw new Error(
      'useApprovalBoxManage must be used within a ApprovalBoxManageProvider'
    );
  }
  return context;
};
