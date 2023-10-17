import SearchBox from '../components/common/SearchBox';
import InnerBox from '../components/common/InnerBox';
import styled from '../styles/pages/FormListPage.module.css';
import ApprovalRegist from './ApprovalRegistPage';
import FormListItem from '../components/approvalManage/formList/FormListItem';
import React, { useEffect, useState } from 'react';
import { useLoading } from '../contexts/LoadingContext';
import getFormList from '../apis/approvalManageAPI/getFormList';
import { usePage } from '../contexts/PageContext';

export default function FormListPage() {
  const [formList, setFormList] = useState([]);
  const { showLoading, hideLoading } = useLoading();
  const { state: pageState, setState: setPageState } = usePage();
  useEffect(() => {
    setPageState({ ...pageState, curPage: '양식조회' });
    showLoading();

    //양식리스트 조회
    getFormList()
      .then((res) => {
        return res.json();
      })
      .then((json) => setFormList(json))
      .catch((e) => {
        console.error(e);
        hideLoading();
      })
      .finally(() => {
        hideLoading();
      });
  }, []);

  return (
    <div className={styled.align}>
      <div className={styled.left_box}>
        <InnerBox width="100%" height="100%">
          <div className={styled.searchBoxContainer}>
            <SearchBox width="200px" />
          </div>
          <FormListItem />
        </InnerBox>
      </div>
      <div className={styled.right_box}>
        <InnerBox width="100%" height="100%" text="전체양식" font_size="18px">
          {formList.map(({ formName, formExplain, formCode }) => {
            return (
              <ApprovalRegist
                width="100%"
                height="78px"
                form_name={formName}
                form_explain={formExplain}
                form_code={formCode}
              />
            );
          })}
        </InnerBox>
      </div>
    </div>
  );
}
