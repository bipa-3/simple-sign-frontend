import React, { useState, useEffect } from 'react';
import styled from '../../../styles/components/formManage/searchBox/SearchBox.module.css';
import {
  ItemBox,
  TextComp,
  InputComp,
} from '../../formManage/searchBox/components/SearchItem';
import { AiOutlineSearch } from 'react-icons/ai';
import DataList from '../../common/DataList';
import { columns } from '../../../assets/datas/form_popup_list';
import getFormListAll from '../../../apis/formManageAPI/getFormListAll';
import { useSeqManage } from '../../../contexts/SeqManageContext';
import getFormListByCompId from '../../../apis/formManageAPI/getFormListByCompId';

export default function FormListPopUp({ setGridData }) {
  const [rows, setRows] = useState([]);
  const [filetedRows, setFiletedRows] = useState([]);
  const { detailData } = useSeqManage();

  // const searchDataHandler = (id, data) => {
  //   setFiletedRows([
  //     ...rows.filter((ele) => {
  //       if (ele.formName.includes(data)) {
  //         return true;
  //       }
  //       return false;
  //     }),
  //   ]);
  // };

  useEffect(() => {
    let deptScopeIdList = detailData.deptScope
      .filter((ele) => {
        console.log('e:', ele);
        if (ele.category === 'C') {
          return true;
        }
        return false;
      })
      .map((ele) => ele.compId);
    console.log('목록조회할1:', deptScopeIdList, deptScopeIdList.length < 1);

    if (deptScopeIdList.length < 1) {
      getFormListAll()
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setRows(data);
          // setFiletedRows(data);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      console.log('목록조회할2:', deptScopeIdList);
      getFormListByCompId({ idList: deptScopeIdList })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setRows(data);
          // setFiletedRows(data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [detailData.deptScope]);

  return (
    <div className={styled.formListContainer}>
      {/* <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ItemBox
          children={
            <>
              <TextComp text={'양식명'} />
              <InputComp
                id={'search'}
                dataHandler={searchDataHandler}
                placeholder={'양식명을 입력하세요.'}
              />
            </>
          }
        />
        <AiOutlineSearch />
      </div> */}
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
