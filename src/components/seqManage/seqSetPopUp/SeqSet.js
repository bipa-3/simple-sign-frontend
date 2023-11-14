import React, { useState, useEffect } from 'react';
import Title from '../../common/Title';
import styled from '../../../styles/components/seqManage/seqSetPopUp/SeqSet.module.css';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import DataList from '../../common/DataList';
import { columns, selectedColumns } from '../../../assets/datas/seq_popup_list';

export default function SeqSet({ seqItems, seqList, setSeqList }) {
  const [previewData, setPreviewData] = useState('');
  const [leftSelectedRow, setLeftSelectedRow] = useState({});
  const [rightSelectedRow, setRightSelectedRow] = useState(seqList[0]);
  let selectedCount =
    seqList.length > 0 ? seqList[seqList.length - 1].id + 1 : 0;

  useEffect(() => {
    setLeftSelectedRow(seqItems[0]);
  }, [seqItems]);

  const leftDataHandler = (data) => {
    setLeftSelectedRow(data);
  };

  const rightDataHandler = (data) => {
    setRightSelectedRow(data);
  };

  const addselectedRows = () => {
    let data = { ...leftSelectedRow, id: selectedCount };
    if (data.value === '자리수') {
      data.value = '자리수 2자리';
    }
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
    if (filtedSeqList.length > 0) {
      setRightSelectedRow(filtedSeqList[0]);
    }
  };

  const RenderCellFunc = (params) => {
    let data = [
      { value: '12', label: '자리수 2자리' },
      { value: '13', label: '자리수 3자리' },
      { value: '14', label: '자리수 4자리' },
      { value: '15', label: '자리수 5자리' },
    ];

    const handleChange = (event) => {
      const newValue = event.target.value;
      let changedLength = seqList.map((ele) => {
        if (ele.value.includes('자리수')) {
          ele.code = newValue;
          ele.value = '자리수 ' + newValue[1] + '자리';
        }
        return ele;
      });
      setSeqList([...changedLength]);
    };
    return (
      <span>
        {params?.value?.includes('자리수') ? (
          <select className={styled.selectBox} onChange={handleChange}>
            {data.map((ele) => {
              console.log(params.value, ele.value, params.value === ele.value);
              return (
                <option
                  key={ele.value}
                  value={ele.value}
                  selected={params.row.code === ele.value}
                >
                  {ele.label}
                </option>
              );
            })}
          </select>
        ) : (
          params.value
        )}
      </span>
    );
  };

  useEffect(() => {
    setPreviewData(
      seqList
        .map((ele) => {
          console.log('changedList:', ele);
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
            columns={selectedColumns.map((ele) => {
              ele.renderCell = RenderCellFunc;
              return ele;
            })}
            dataHandler={rightDataHandler}
          />
        </div>
      </div>
      <Title text={'미리보기'} font_size={'18px'}></Title>
      <div className={styled.preViewArea}>{previewData}</div>
    </div>
  );
}
