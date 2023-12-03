import React, { useEffect, useState } from 'react';
import styled from '../../styles/pages/HomePageApprovalBox.module.css';
import InnerBox from '../common/InnerBox';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';
import getDocsList from '../../apis/approvalBoxAPI/getDocsList'; // API 호출 함수 임포트
import { CiFileOff } from 'react-icons/ci';

export default function ProgressDoc() {
  const navigate = useNavigate();
  const [recentPDocuments, setRecentPDocuments] = useState([]); // API 응답 데이터를 저장할 상태

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const viewItems = ['send']; // 상신문서에 해당하는 viewItems
        const sortStatus = 'desc';
        const response = await getDocsList(
          viewItems,
          10,
          '',
          sortStatus,
          'ongoingdoc',
          null,
          null
        );
        const docList = response.data || [];
        const recentPDocs = docList
          .filter((doc) => doc.docStatus === 'P')
          .slice(0, 3);
        setRecentPDocuments(recentPDocs);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    fetchDocs();
  }, []); // 의존성 배열이 비어있으므로 컴포넌트가 마운트될 때 한 번만 실행

  function handlePlusClick() {
    navigate(`/ABV?viewItems=send&name=${'상신문서'}`);
  }

  function clickDocument(docId) {
    const popupOptions = 'width=1200,height=700,left=100,top=100';
    window.open(`/AD?page=${docId}&popup=true`, '_blank', popupOptions);
  }

  const getBgColor = (status) => {
    if (status === 'A') {
      return '#1abc9c';
    } else if (status === 'P') {
      return '#46A3F0';
    } else if (status === 'R') {
      return '#f1556c';
    } else if (status === 'W') {
      return '#f7b84b';
    } else {
      return '';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'A':
        return '승인'; // 종결 텍스트
      case 'P':
        return '진행'; // 진행 텍스트
      case 'R':
        return '반려'; // 반려 텍스트
      case 'W':
        return '상신'; // 상신 텍스트
      default:
        return ''; // 기본값 (아무 텍스트도 표시하지 않음)
    }
  };

  return (
    <InnerBox
      width={'100%'}
      height={'100%'}
      text={'진행중인문서'}
      font_size="16px"
      childStyle={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      titleChildren={
        <Button
          label={'+ 더 보기'}
          btnStyle={'light_btn'}
          onClick={handlePlusClick}
          width="65px"
          height="30px"
          fontSize="10px"
        />
      }
      children={
        <div className={styled.container}>
          <hr style={{ margin: 0 }}></hr>
          <div className={styled.itemContainer}>
            {recentPDocuments.length > 0 ? (
              recentPDocuments.map((doc) => (
                <div key={doc.approvalDocId}>
                  <div
                    className={styled.itembox}
                    onClick={() => clickDocument(doc.approvalDocId)}
                  >
                    <div className={styled.dateText}>{doc.sendDate}</div>
                    <div className={styled.element}>
                      <div className={styled.elementText}>
                        <span>{doc.approvalDocTitle}</span>
                      </div>
                      <div className={styled.info}>
                        <div className={styled.txtinfo}>{doc.formName}</div>
                        <div className={styled.bar}>|</div>
                        <div className={styled.txtinfo}>
                          {doc.approvalDocId}
                        </div>
                      </div>
                    </div>
                    <div className={styled.docUser}>
                      <div className={styled.imginfo}></div>
                      <div className={styled.userinfo}>
                        <div className={styled.name}>{doc.userName}</div>
                        <div className={styled.departementInfo}>
                          <div className={styled.departementList}>
                            <div className={styled.txtdep}>{doc.deptName}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styled.docStatus}>
                      <div className={styled.process}>
                        <div className={styled.txtline}>
                          <div
                            className={styled.txtline}
                            style={{
                              color: 'white',
                              backgroundColor: getBgColor(doc.docStatus),
                            }}
                          >
                            <span>{getStatusText(doc.docStatus)}</span>
                            <span>
                              {'(' +
                                (doc.docStatus === 'A' ||
                                doc.docStatus === 'R' ||
                                doc.docStatus === 'P'
                                  ? doc.lastUser
                                  : doc.docStatus === 'W'
                                  ? doc.userName
                                  : '') +
                                ')'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={styled.noDocumentsContainer}>
                <div className={styled.noDocumentsIcon}>
                  <CiFileOff />
                </div>
                <div>조회된 데이터가 없습니다.</div>
              </div>
            )}
          </div>
        </div>
      }
    />
  );
}
