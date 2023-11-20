import React, { useState, useEffect } from 'react';
import styled from '../../../styles/components/formManage/searchBox/SearchBox.module.css';
import DataList from '../../common/DataList';
import { columns } from '../../../assets/datas/form_popup_list';
import getFormListAll from '../../../apis/formManageAPI/getFormListAll';
import { useSeqManage } from '../../../contexts/SeqManageContext';
import getFormListByCompId from '../../../apis/formManageAPI/getFormListByCompId';

export default function FormListPopUp({ setGridData }) {
  const [rows, setRows] = useState([]);
  const { detailData } = useSeqManage();

  useEffect(() => {
    if (detailData.compId === '') {
      return;
    }
    if (detailData.compId === 1) {
      getFormListAll()
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setRows(data);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      getFormListByCompId({ idList: [detailData.compId] })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setRows(data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [detailData.compId]);

  return (
    <div className={styled.formListContainer}>
      <DataList
        rows={rows}
        columns={columns}
        dataHandler={setGridData}
        isCheckTable={true}
        initData={detailData.formScope}
      />
    </div>
  );
}
