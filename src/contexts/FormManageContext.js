import React, { createContext, useContext, useState } from 'react';

const searchInitState = {
  id: 0,
  compId: '',
  compName: '',
  formName: '',
  status: 1,
};

const setInitState = {
  compList: [],
  statusList: [
    { name: '사용', id: 1 },
    { name: '미사용', id: 0 },
  ],
};

const detailInitState = {
  code: '',
  compId: '',
  compName: '',
  formName: '',
  scope: [],
  scope2: [],
  defaultForm: '',
  mainForm: '',
  status: '',
  approvalLine: [],
  formExplain: '',
};

//0: default, 1: create, 2: update,
const flagInitState = { flag: 0 };

const FormManageContext = createContext();

const FormManageProvider = ({ children }) => {
  const [searchData, setSearchData] = useState(searchInitState);
  const [setData, setSetData] = useState(setInitState);
  const [detailData, setDetailData] = useState(detailInitState);
  const [flagData, setFlagData] = useState(flagInitState);

  const createDetailData = () => {
    setFlagData(1);
    setDetailData({
      ...detailInitState,
      code: '',
      compId:
        setData.compList[0].id === 0
          ? setData.compList[1].id
          : setData.compList[0].id,
      compName: setData.compList[0].name,
      status: 1,
    });
  };
  const updateDetailData = () => {
    setFlagData(2);
  };
  const defaultDetailData = () => {
    setFlagData(0);
  };

  const resetDetailData = () => {
    setDetailData(detailInitState);
    setFlagData(0);
  };

  return (
    <FormManageContext.Provider
      value={{
        searchData,
        setSearchData,
        setData,
        setSetData,
        detailData,
        setDetailData,
        flagData,
        createDetailData,
        updateDetailData,
        defaultDetailData,
        resetDetailData,
      }}
    >
      {children}
    </FormManageContext.Provider>
  );
};

const useFormManage = () => {
  const context = useContext(FormManageContext);
  if (!context) {
    throw new Error('useFormManage must be used within a FormManageProvider');
  }
  return context;
};

export { useFormManage, FormManageProvider };
