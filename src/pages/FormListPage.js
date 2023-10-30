import SearchBox from '../components/common/SearchBox';
import InnerBox from '../components/common/InnerBox';
import styled from '../styles/pages/FormListPage.module.css';
import ApprovalRegist from './ApprovalRegistPage';
import FormListItem from '../components/approvalManage/formList/FormListItem';
import React, { useEffect, useState } from 'react';
import { useLoading } from '../contexts/LoadingContext';
import getFormList from '../apis/approvalManageAPI/getFormList';
import { usePage } from '../contexts/PageContext';
import errorHandle from '../apis/errorHandle';
import { useNavigate } from 'react-router-dom';
import getFavorites from '../apis/approvalManageAPI/getFavorites';

export default function FormListPage() {
  const [formList, setFormList] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchContent, setSearchContent] = useState('');
  const { showLoading, hideLoading } = useLoading();
  const { state: pageState, setState: setPageState } = usePage();
  const navigate = useNavigate();

  useEffect(() => {
    setPageState({ ...pageState, curPage: '양식조회' });
    showLoading();

    //양식리스트 조회
    getFormList({ searchContent })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          errorHandle(res);
          navigate('/');
        }
      })
      .then((json) => setFormList(json))
      .catch((e) => {
        console.error(e);
        hideLoading();
      })
      .finally(() => {
        hideLoading();
      });

    getFavorites()
      .then((res) => {
        let updateFavorites = [];
        res.forEach((ele) => {
          updateFavorites.push(ele.formCode);
        });
        setFavorites((prevFavorites) => [...prevFavorites, ...updateFavorites]);
      })
      .catch((e) => {
        console.error(e);
      });
  }, [searchContent]);

  const onSearch = (searchItem) => {
    setSearchContent(searchItem);
  };

  return (
    <div className={styled.align}>
      <div className={styled.containers}>
        <InnerBox width="100%" height="100%">
          <div className={styled.searchBoxContainer}>
            <SearchBox width="200px" onSearch={onSearch} />
          </div>
          <FormListItem />
        </InnerBox>
      </div>
      <div className={styled.containers}>
        <InnerBox width="100%" height="100%" text="전체양식" font_size="18px">
          <div className={styled.innerBox}>
            {!formList.isEmpty
              ? formList.map(({ formName, formExplain, formCode }) =>
                  favorites.includes(formCode) ? (
                    <ApprovalRegist
                      key={formCode} // 반복 요소에는 고유한 키를 제공해야 합니다.
                      width="100%"
                      height="78px"
                      form_name={formName}
                      form_explain={formExplain}
                      form_code={formCode}
                      favorites={true}
                    />
                  ) : (
                    <ApprovalRegist
                      key={formCode} // 반복 요소에는 고유한 키를 제공해야 합니다.
                      width="100%"
                      height="78px"
                      form_name={formName}
                      form_explain={formExplain}
                      form_code={formCode}
                      favorites={false}
                    />
                  )
                )
              : null}
          </div>
        </InnerBox>
      </div>
    </div>
  );
}
