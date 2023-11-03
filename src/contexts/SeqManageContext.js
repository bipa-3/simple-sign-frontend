import React, { createContext, useContext, useState } from 'react';

// 검색박스 데이터
const searchInitState = {
  id: 0,
  compId: '',
  compName: '',
  seqName: '',
  code: '',
};

// 초기 검색창 데이터
const setInitState = {
  compList: [],
};

// seqItems 데이터
const setInitSeqItems = {
  seqList: [],
};

const detailInitState = {
  compName: '',
  compId: '',
  code: '',
  seqName: '',
  deptScope: [],
  formScope: [],
  description: '',
  sortOrder: '',
  seqList: '',
  seqString: '',
};

//0: default, 1: create, 2: update,
const flagInitState = { flag: 0 };

const SeqManageContext = createContext();

const SeqManageProvider = ({ children }) => {
  const [searchData, setSearchData] = useState(searchInitState);
  const [setData, setSetData] = useState(setInitState);
  const [detailData, setDetailData] = useState(detailInitState);
  const [flagData, setFlagData] = useState(flagInitState);
  const [seqItems, setSeqItems] = useState(setInitSeqItems);

  const createDetailData = () => {
    let compId = setData.compList[1].id;
    let deptScope = [];

    console.log(compId, deptScope);
    setFlagData(1);
    setDetailData({
      ...detailInitState,
      compId,
      compName: setData.compList[0].name,
      deptScope,
    });
  };
  const updateDetailData = () => {
    setFlagData(2);
  };
  const defaultDetailData = () => {
    setFlagData(0);
  };

  return (
    <SeqManageContext.Provider
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
        seqItems,
        setSeqItems,
      }}
    >
      {children}
    </SeqManageContext.Provider>
  );
};

const useSeqManage = () => {
  const context = useContext(SeqManageContext);
  if (!context) {
    throw new Error('useFormManage must be used within a FormManageProvider');
  }
  return context;
};

export { useSeqManage, SeqManageProvider };
