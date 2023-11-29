import React, { useEffect, useRef, useState } from 'react';
import ReplyDetail from './ReplyDetail';
import styled from '../../../styles/components/approvalManage/approvalDetail/ReplyDetail.module.css';
import getReplyList from '../../../apis/approvalManageAPI/getReplyList';
import insertLowerReply from '../../../apis/approvalManageAPI/insertLowerReply';
import ReplyBox from './ReplyBox';
import ErrorHandle from '../../../apis/errorHandle';
import { checkReplyCreateData } from '../../../validation/approvalManage/replySchema';
import { useAlert } from '../../../contexts/AlertContext';

export default function ReplyForm({ approval_doc_id }) {
  const [replyList, setReplyList] = useState([]);
  const [groupedReplies, setGroupedReplies] = useState({});
  const [showReplyTextarea, setShowReplyTextarea] = useState([false]);
  const replyRefs = useRef([]);
  const upperReplyRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const { showAlert } = useAlert();

  const handleInsertReply = (index) => {
    const updatedShowReplyTextarea = [...showReplyTextarea];
    updatedShowReplyTextarea[index] = true;
    setShowReplyTextarea(updatedShowReplyTextarea);
  };

  const handleReplyBoxHide = (index) => {
    const updatedShowReplyTextarea = [...showReplyTextarea];
    updatedShowReplyTextarea[index] = false;
    setShowReplyTextarea(updatedShowReplyTextarea);
  };

  const handleReplyInsert = (upperReplyId, index, groupNo) => {
    let content = '';
    if (upperReplyId !== null) {
      content = replyRefs.current[index].current.value;
    } else {
      content = upperReplyRef.current.value;
    }

    const replyData = {
      approvalDocId: approval_doc_id,
      upperReplyId: upperReplyId,
      replyContent: content,
      groupNo: groupNo,
    };

    const data = new FormData();

    data.append(
      'replyReqDTO',
      new Blob([JSON.stringify(replyData)], {
        type: 'application/json',
      })
    );
    files.forEach((file, index) => {
      data.append('files', file.object);
    });

    checkReplyCreateData(replyData)
      .then(() => {
        insertLowerReply(data)
          .then((res) => {
            if (res.status === 200) {
              showAlert({
                severity: 'info',
                message: '댓글이 작성되었습니다.',
              });
              getReply();
              handleReplyBoxHide(index);
              setInputValue('');
              replyRefs.current[index].value = '';
            } else {
              ErrorHandle(res);
            }
          })
          .catch((e) => {
            console.error(e);
          });
      })
      .catch((e) => {
        showAlert({
          severity: 'error',
          message: e.message,
        });
      });
  };

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
  }, [replyList, replyRefs]);

  const getReply = () => {
    getReplyList(approval_doc_id)
      .then((res) => {
        setReplyList(res);
        replyRefs.current.textContent = null;
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    //댓글리스트 가져오기
    getReply();
  }, [approval_doc_id]);
  return (
    <div className={styled.replyContainer}>
      <div className={styled.replyBox}>
        <ReplyBox
          replyRef={upperReplyRef}
          index={null}
          replyId={null}
          groupNo={null}
          handleReplyInsert={handleReplyInsert}
          files={files}
          setFiles={setFiles}
          fileNames={fileNames}
          setFileNames={setFileNames}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />
      </div>
      <div className={styled.subReplyContainer}>
        {Object.keys(groupedReplies).map((groupNo, index) => {
          return (
            <div key={groupNo}>
              {groupedReplies[groupNo]
                .sort((a, b) => a.groupOrd - b.groupOrd)
                .map((data) => {
                  if (data.depth === 1) {
                    return (
                      <>
                        <ReplyDetail
                          key={data.replyId}
                          replyId={data.replyId}
                          regdate={data.regDate}
                          content={data.replyContent}
                          filePath={data.approvalFilePath}
                          userName={data.userName}
                          index={index}
                          isSecondDept={false}
                          handleInsertReply={handleInsertReply}
                          getReply={getReply}
                          files={files}
                          setFiles={setFiles}
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
                            files={files}
                            setFiles={setFiles}
                            fileNames={fileNames}
                            setFileNames={setFileNames}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
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
                          filePath={data.approvalFilePath}
                          userName={data.userName}
                          groupNo={data.groupNo}
                          index={index}
                          isSecondDept={true}
                          getReply={getReply}
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
