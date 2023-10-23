import React, { createContext, useState, useContext } from 'react';

const initialState = {
  boxId: null,
  insertStatus: 0,
  compId: null,
};

const approvalBoxInit = {
  approvalBoxId: null,
  compId: null,
  approvalBoxName: null,
  viewItems: [],
  approvalBoxUsedStatus: 1,
  menuUsingRange: 'T',
  sortOrder: null,
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
  const [initDataState, setInitDataState] = useState(initData);
  const [detailData, setDetailData] = useState(detailInitState);

  return (
    <ApprovalBoxManageContext.Provider
      value={{
        state,
        setState,
        approvalBoxState,
        setApprovalBoxState,
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
