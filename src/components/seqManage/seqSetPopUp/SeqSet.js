import React, { useState, useEffect } from 'react';
import Title from '../../common/Title';
import styled from '../../../styles/components/seqManage/seqSetPopUp/SeqSet.module.css';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import DataList from '../../formManage/formList/DataList';
import { columns } from '../../../assets/datas/seq_popup_list';

export default function SeqSet({ seqItems, seqList, setSeqList }) {
  const [previewData, setPreviewData] = useState('');
  const [leftSelectedRow, setLeftSelectedRow] = useState({});
  const [rightSelectedRow, setRightSelectedRow] = useState({});
  let selectedCount =
    seqList.length > 0 ? seqList[seqList.length - 1].id + 1 : 0;

  const leftDataHandler = (data) => {
    setLeftSelectedRow(data);
  };

  const rightDataHandler = (data) => {
    setRightSelectedRow(data);
  };

  const addselectedRows = () => {
    let data = { ...leftSelectedRow, id: selectedCount };
    setSeqList([...seqList, data]);
    selectedCount++;
  };

  const delselectedRows = () => {
    let filtedSeqList = seqList.filter((ele) => {
      if (ele.id !== rightSelectedRow.id) {
        setRightSelectedRow({});
        return true;
      }
      return false;
    });
    setSeqList(filtedSeqList);
  };

  useEffect(() => {
    setPreviewData(
      seqList
        .map((ele) => {
          return ele.value;
        })
        .join(' ')
    );
  }, [seqList]);

  return (
    <div className={styled.seqSetPopUpContainer}>
      <Title text={'채번항목'} font_size={'18px'}></Title>
      <div className={styled.seqListArea}>
        <div>
          <DataList
            rows={seqItems}
            columns={columns}
            dataHandler={leftDataHandler}
          />
        </div>
        <div>
          <BsChevronLeft
            className={styled.arrowBox}
            onClick={(e) => {
              delselectedRows(e);
            }}
          />
          <BsChevronRight
            className={styled.arrowBox}
            onClick={(e) => {
              addselectedRows(e);
            }}
          />
        </div>
        <div>
          <DataList
            rows={seqList}
            columns={columns}
            dataHandler={rightDataHandler}
          />
        </div>
      </div>
      <Title text={'미리보기'} font_size={'18px'}></Title>
      <div className={styled.preViewArea}>{previewData}</div>
    </div>
  );
}
