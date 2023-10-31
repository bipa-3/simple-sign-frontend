import InnerBox from '../../common/InnerBox';
import DataList from './DataList';
import { columns } from '../../../assets/datas/form_manage_list';
import getFormDetail from '../../../apis/commonAPI/getFormDetail';
import { useFormManage } from '../../../contexts/FormManageContext';
import React, { useEffect } from 'react';
import Button from '../../common/Button';
import delForm from '../../../apis/commonAPI/delForm';
import getDefaultApprovalLine from '../../../apis/commonAPI/getDefaultApprovalLine';
import { useLoading } from '../../../contexts/LoadingContext';
import getApprovalKind from '../../../apis/commonAPI/getApprovalKind';

export default function FormListArea({ rows, searchHandler }) {
  const { detailData, setDetailData, updateDetailData, setData, setSetData } =
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
        console.log(`데이터 삭제를 실패했습니다. [${err}]`);
      })
      .finally(() => {
        hideLoading();
      });
  };

  const dataHandler = (data) => {
    showLoading();
    updateDetailData();
    Promise.all([
      getFormDetail(data.id),
      getDefaultApprovalLine(data.id),
      getApprovalKind(),
    ])
      .then(([formDetailRes, approvalLineRes, approvalKindList]) => {
        return Promise.all([
          formDetailRes.json(),
          approvalLineRes.json(),
          approvalKindList.json(),
        ]);
      })
      .then(([formDetailData, approvalLineData, approvalKindList]) => {
        setSetData({
          ...setData,
          approvalKindList: approvalKindList.map((ele) => {
            ele.id = ele.id.toString().padStart(2, '0');
            return ele;
          }),
        });

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

  useEffect(() => {
    if (rows.length > 0) {
      dataHandler(rows[0]);
    }
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
