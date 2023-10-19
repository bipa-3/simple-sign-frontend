import React, { createContext, useState, useContext } from 'react';

const initialState = {
  searchBtnStatus: false,
  shouldFetchDocs: false,
  searchInput: '',
  view: false,
  boxViewItems: [],
  radioSortValue: 'alldoc',
  selectSortDate: '',
  topSelectSortDate: '',
  rowSelectSortDate: '',
  rerender: false,
  isReadDoc: '',
  docView: [],
};

const detailSearchInitState = {
  searchDate: '',
  startDate: null,
  endDate: null,
  searchTitle: '',
  searchContent: '',
  searchDept: '',
  searchWriter: '',
  searchApprovUser: '',
  searchApprovState: '',
  searchDocForm: '',
  searchDocNumber: '',
};

const approvalDocCount = {
  sendCount: 0,
  pendCount: 0,
  concludedCount: 0,
  referenceCount: 0,
};

const customBoxViewItemInitState = [];

const ApprovalBoxContext = createContext();

export const ApprovalBoxProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  const [detailSearchState, setDetailSearchState] = useState(
    detailSearchInitState
  );
  const [customBoxViewItemState, setCustomBoxViewItemState] = useState(
    customBoxViewItemInitState
  );
  const [count, setCount] = useState(approvalDocCount);

  return (
    <ApprovalBoxContext.Provider
      value={{
        state,
        setState,
        detailSearchState,
        setDetailSearchState,
        detailSearchInitState,
        customBoxViewItemState,
        setCustomBoxViewItemState,
        count,
        setCount,
      }}
    >
      {children}
    </ApprovalBoxContext.Provider>
  );
};

export const useApprovalBox = () => {
  const context = useContext(ApprovalBoxContext);
  if (!context) {
    throw new Error('useApprovalBox must be used within a ApprovalBoxProvider');
  }
  return context;
};
