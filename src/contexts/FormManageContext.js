import React, { createContext, useContext, useState } from 'react';

const searchInitState = {
  id: 0,
  compId: 0,
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
  approvalKindList: [],
};

const detailInitState = {
  code: '',
  compId: 0,
  compName: '',
  formName: '',
  scope: [],
  scope2: [],
  defaultForm: '',
  mainForm: '',
  status: '',
  approvalLineStatus: 0,
  approvalLine: [],
  formExplain: '',
  approvalKind: '',
};

//0: default, 1: create, 2: update,
const flagInitState = { flag: 0 };

const FormManageContext = createContext();

const FormManageProvider = ({ children }) => {
  const [searchData, setSearchData] = useState(searchInitState);
  const [setData, setSetData] = useState(setInitState);
  const [detailData, setDetailData] = useState(detailInitState);
  const [flagData, setFlagData] = useState(flagInitState);

  const detailDataInit = () => {
    setDetailData({ ...detailInitState });
  };

  const searchDataInit = () => {
    setDetailData({ ...searchInitState });
  };

  const setDataInit = () => {
    setDetailData({ ...searchInitState });
  };

  const createDetailData = () => {
    let compId = setData?.compList[1]?.id || setData?.compList[0]?.id;
    let scope = [];

    setFlagData(1);
    setDetailData({
      ...detailInitState,
      code: '',
      compId,
      compName: setData.compList[0].name,
      status: 1,
      approvalKind: setData.approvalKindList[0].id,
      scope,
    });
  };
  const updateDetailData = () => {
    detailDataInit();
    setFlagData(2);
  };
  const defaultDetailData = () => {
    setFlagData(0);
  };

  const resetDetailData = () => {
    detailDataInit();
    setFlagData(0);
  };

  const setDetailDataById = (id, data) => {
    setDetailData({ ...detailData, [id]: data });
  };

  const setSearchDataById = (id, data) => {
    setSearchData({ ...searchData, [id]: data });
  };

  const setSetDataById = (id, data) => {
    setSetData({ ...setData, [id]: data });
  };

  return (
    <FormManageContext.Provider
      value={{
        searchData,
        setSearchData,
        setData,
        setSetData,
        setDetailDataById,
        setSearchDataById,
        setSetDataById,
        detailData,
        setDetailData,
        flagData,
        createDetailData,
        updateDetailData,
        defaultDetailData,
        resetDetailData,
        searchDataInit,
        detailDataInit,
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
