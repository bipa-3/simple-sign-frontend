import React, { useEffect, useState } from 'react';
import styled from '../../styles/pages/HomePageApprovalBox.module.css';
import InnerBox from '../common/InnerBox';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';
import getDocsList from '../../apis/approvalBoxAPI/getDocsList'; // API 호출 함수 임포트
import { CiFileOff } from 'react-icons/ci';

export default function ReceivedRef() {
  const navigate = useNavigate();
  const [recentPDocuments, setRecentPDocuments] = useState([]); // API 응답 데이터를 저장할 상태

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const viewItems = ['reference']; // 상신문서에 해당하는 viewItems
        const offset = 0; // 페이지네이션을 사용하지 않는다면 offset은 0으로 설정
        const sortStatus = 'desc';
        const response = await getDocsList(
          viewItems,
          10,
          offset,
          '',
          sortStatus
        );
        const docList = response.data.docList || [];

        const recentPDocs = docList.slice(0, 2);
        setRecentPDocuments(recentPDocs);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    fetchDocs();
  }, []); // 의존성 배열이 비어있으므로 컴포넌트가 마운트될 때 한 번만 실행

  function handlePlusClick() {
    navigate(`/ABV?viewItems=reference&name=${'수신참조문서'}`);
  }

  function clickDocument(docId) {
    const popupOptions = 'width=1200,height=700,left=100,top=100';
    window.open(`/AD?page=${docId}&popup=true`, '_blank', popupOptions);
  }

  return (
    <InnerBox
      width={'100%'}
      height={'100%'}
      text={'수신참조함'}
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
        <>
          <div className={styled.container}>
            <hr style={{ margin: 0 }}></hr>
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
                          <span>
                            {doc.docStatus === 'A' ||
                            doc.docStatus === 'R' ||
                            doc.docStatus === 'P'
                              ? doc.lastUser
                              : doc.docStatus === 'W'
                              ? doc.userName
                              : ''}
                          </span>
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
        </>
      }
    />
  );
}
