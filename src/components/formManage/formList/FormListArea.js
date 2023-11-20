import InnerBox from '../../common/InnerBox';
import DataList from '../../common/DataList';
import { columns } from '../../../assets/datas/form_manage_list';
import getFormDetail from '../../../apis/formManageAPI/getFormDetail';
import { useFormManage } from '../../../contexts/FormManageContext';
import React, { useEffect } from 'react';
import Button from '../../common/Button';
import delForm from '../../../apis/formManageAPI/delForm';
import getDefaultApprovalLine from '../../../apis/formManageAPI/getDefaultApprovalLine';
import { useLoading } from '../../../contexts/LoadingContext';

export default function FormListArea({ rows, searchHandler }) {
  const { detailData, setDetailData, updateDetailData, detailDataInit } =
    useFormManage();
  const { showLoading, hideLoading } = useLoading();

  const delHandler = () => {
    showLoading();
    delForm(detailData.code)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        alert('데이터가 삭제되었습니다.');
      })
      .then(() => {
        searchHandler();
      })
      .catch((err) => {
        let errorMessage = `데이터 삭제를 실패했습니다. [${err}]`;
        if (err.message === '409') {
          errorMessage = `사용중인 양식은 삭제가 불가합니다. [${err}]`;
        }
        alert(errorMessage);
      })
      .finally(() => {
        hideLoading();
      });
  };

  const dataHandler = (data) => {
    showLoading();
    updateDetailData();
    Promise.all([getFormDetail(data.id), getDefaultApprovalLine(data.id)])
      .then(([formDetailRes, approvalLineRes]) => {
        return Promise.all([formDetailRes.json(), approvalLineRes.json()]);
      })
      .then(([formDetailData, approvalLineData]) => {
        let approvalLineList = approvalLineData.map((ele, index) => {
          ele.approvalKind = '결재(기본결재라인)';
          ele.id = index + 1;
          return ele;
        });

        setDetailData({
          ...detailData,
          ...formDetailData,
          compName: data.compName,
          status: formDetailData.status === true ? 1 : 0,
          approvalLineStatus:
            formDetailData.approvalLineStatus === true ? 1 : 0,
          approvalLine: approvalLineList,
        });
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        hideLoading();
      });
  };

  // 검색된 리스트가 있으면 상세 검색
  useEffect(() => {
    if (rows.length > 0) {
      dataHandler(rows[0]);
    }
    detailDataInit();
  }, [rows]);

  return (
    <InnerBox
      text={'양식목록'}
      width={'100%'}
      height={'100%'}
      titleChildren={
        <Button label={'삭제'} btnStyle={'red_btn'} onClick={delHandler} />
      }
      childStyle={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        padding: '0px 0px 20px 0px',
      }}
      children={
        <DataList rows={rows} columns={columns} dataHandler={dataHandler} />
      }
    />
  );
}
