import InnerBox from '../../common/InnerBox';
import DataList from '../../common/DataList';
import { columns } from '../../../assets/datas/seq_manage_list';
import React, { useEffect } from 'react';
import Button from '../../common/Button';
import getSeqDetail from '../../../apis/seqManageAPI/getSeqDetail';
import { useSeqManage } from '../../../contexts/SeqManageContext';
import delSeq from '../../../apis/seqManageAPI/delSeq';
import { useLoading } from '../../../contexts/LoadingContext';
import { useAlert } from '../../../contexts/AlertContext';

export default function SeqListArea({ rows, searchHandler }) {
  const { detailData, setDetailData, updateDetailData } = useSeqManage();
  const { showLoading, hideLoading } = useLoading();
  const { showAlert } = useAlert();

  const delHandler = () => {
    showLoading();
    delSeq(detailData.code)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        showAlert({
          severity: 'success',
          message: `채번 데이터가 삭제되었습니다.`,
        });
      })
      .then(() => {
        searchHandler();
      })
      .catch((err) => {
        showAlert({
          severity: 'error',
          message: `채번 데이터 삭제를 실패했습니다. [${err}]`,
        });
      })
      .finally(() => {
        hideLoading();
      });
  };

  const dataHandler = (data) => {
    showLoading();
    getSeqDetail(data.id)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res.json();
      })
      .then((res) => {
        updateDetailData();
        setDetailData({
          ...detailData,
          ...res,
          compName: data.compName,
        });
      })
      .catch((err) => {
        showAlert({
          severity: 'error',
          message: `상세 데이터 호출에 실패했습니다. [${err}]`,
        });
      })
      .finally(() => {
        hideLoading();
      });
  };

  useEffect(() => {
    if (rows.length > 0) {
      dataHandler(rows[0]);
    }
  }, [rows]);

  return (
    <InnerBox
      text={'채번목록'}
      width={'100%'}
      height={'100%'}
      font_size="16px"
      titleChildren={
        <Button label={'삭제'} btnStyle={'red_btn'} onClick={delHandler} />
      }
      childStyle={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        padding: '0px 0px 25px 0px',
      }}
      children={
        <DataList rows={rows} columns={columns} dataHandler={dataHandler} />
      }
    />
  );
}
