import React, { useEffect, useRef, useState } from 'react';
import ReplyDetail from './ReplyDetail';
import styled from '../../../styles/components/approvalManage/approvalDetail/ReplyDetail.module.css';
import getReplyList from '../../../apis/approvalManageAPI/getReplyList';
import insertLowerReply from '../../../apis/approvalManageAPI/insertLowerReply';
import ReplyBox from './ReplyBox';

export default function ReplyForm({ approval_doc_id }) {
  const [replyList, setReplyList] = useState([]);
  const [groupedReplies, setGroupedReplies] = useState({});
  const [showReplyTextarea, setShowReplyTextarea] = useState([false]);
  const replyRefs = useRef([]);
  const upperReplyRef = useRef(null);

  useEffect(() => {
    //댓글리스트 가져오기
    getReplyList(approval_doc_id)
      .then((res) => {
        setReplyList(res);
      })
      .catch((e) => {
        console.error(e);
      });
  }, [approval_doc_id]);

  useEffect(() => {
    if (replyList.length !== 0) {
      const updatedGroupReplies = {};
      replyList.forEach((data, index) => {
        if (!updatedGroupReplies[data.groupNo]) {
          updatedGroupReplies[data.groupNo] = [];
          const updateShowReplyTextarea = [...showReplyTextarea];
          updateShowReplyTextarea.push(false);
          setShowReplyTextarea(updateShowReplyTextarea);

          // replyRefs를 업데이트할 때 새로운 Ref 생성
          const newRefs = [...replyRefs.current];
          newRefs.push(React.createRef());
          replyRefs.current = newRefs;
        }
        updatedGroupReplies[data.groupNo].push(data);
      });
      setGroupedReplies(updatedGroupReplies);
    }
  }, [replyList]);

  const handleInsertReply = (index) => {
    const updatedShowReplyTextarea = [...showReplyTextarea]; // showReplyTextarea 배열 복사
    updatedShowReplyTextarea[index] = true; // 원하는 index 위치의 값을 변경
    setShowReplyTextarea(updatedShowReplyTextarea); // 업데이트된 배열을 상태로 설정
  };
  const handleReplyInsert = (upperReplyId, index, groupNo) => {
    let content = '';
    //console.log(upperReplyId);
    if (upperReplyId !== null) {
      content = replyRefs.current[index].current.value;
    } else {
      content = upperReplyRef.current.value;
    }

    // console.log(content);
    // console.log(upperReplyId);
    const data = {
      approvalDocId: approval_doc_id,
      upperReplyId: upperReplyId,
      replyContent: content,
      groupNo: groupNo,
    };
    insertLowerReply(data)
      .then((res) => {
        //console.log(res);
        if (res.status === 200) {
          alert('댓글이 작성되었습니다.');
        } else {
          alert('댓글작성 실패!');
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };
  return (
    <div className={styled.replyContainer}>
      <div className={styled.replyBox}>
        <ReplyBox
          replyRef={upperReplyRef}
          index={null}
          replyId={null}
          groupNo={null}
          handleReplyInsert={handleReplyInsert}
        />
      </div>
      <div className={styled.subReplyContainer}>
        {Object.keys(groupedReplies).map((groupNo, index) => {
          // const groupReplies = groupedReplies[groupNo];
          // groupReplies.sort((a, b) => a.groupOrd - b.groupOrd);
          return (
            <div key={groupNo}>
              {groupedReplies[groupNo].map((data) => {
                if (data.depth === 1) {
                  return (
                    <>
                      <ReplyDetail
                        key={data.replyId}
                        replyId={data.replyId}
                        user={data.orgUserId}
                        regdate={data.regDate}
                        content={data.replyContent}
                        groupOrd={data.groupOrd}
                        groupNo={data.groupNo}
                        index={index}
                        isSecondDept={false}
                        handleInsertReply={handleInsertReply}
                      />
                      <div
                        replyId={data.replyId}
                        className={
                          showReplyTextarea[index]
                            ? styled.replyContent
                            : styled.hideReplyContent
                        }
                      >
                        <ReplyBox
                          replyRef={replyRefs.current[index]}
                          index={index}
                          replyId={data.replyId}
                          groupNo={data.groupNo}
                          handleReplyInsert={handleReplyInsert}
                        />
                      </div>
                    </>
                  );
                } else if (data.depth === 2) {
                  return (
                    <>
                      <ReplyDetail
                        key={data.replyId}
                        replyId={data.replyId}
                        user={data.orgUserId}
                        regdate={data.regDate}
                        content={data.replyContent}
                        groupNo={data.groupNo}
                        index={index}
                        groupOrd={data.groupOrd}
                        isSecondDept={true}
                      />
                    </>
                  );
                }
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
