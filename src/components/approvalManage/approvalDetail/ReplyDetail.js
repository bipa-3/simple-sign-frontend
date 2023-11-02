import React, { useState, useEffect, useRef } from 'react';
import styled from '../../../styles/components/approvalManage/approvalDetail/ReplyDetail.module.css';
// import Button from '../../common/Button';
import { Avatar } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { styled as MUIStyled } from '@mui/material';
import getIsEditReply from '../../../apis/approvalManageAPI/getIsEditReply';
import deleteReply from '../../../apis/approvalManageAPI/deleteReply';
import updateReply from '../../../apis/approvalManageAPI/updateReply';
import errorHandle from '../../../apis/errorHandle';
import { checkReplyCreateData } from '../../../validation/approvalManage/replySchema';
import downloadFile from '../../../apis/approvalManageAPI/downloadFile';
import { useLoading } from '../../../contexts/LoadingContext';
import getReplyFileNames from '../../../apis/approvalManageAPI/getReplyFileNames';

const CustomButton = MUIStyled(Button)({
  width: '0.5em',
  '&.MuiButton-sizeSmall': {
    minWidth: '50px',
  },
});

export default function ReplyDetail({
  replyId,
  regdate,
  content,
  filePath,
  userName,
  index,
  isSecondDept,
  handleInsertReply,
  getReply,
}) {
  const contentEditableRef = useRef(content);
  const [isEdit, setIsEdit] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const { showLoading, hideLoading } = useLoading();
  const [filesData, setFilesData] = useState({ replyId: null, object: [] });

  const updateHandler = () => {
    //권한가져오고 권한이 있으면 contentEditable로 바꿔주기
    getIsEditReply(replyId)
      .then((res) => {
        if (res === true) {
          setIsEdit(res);
        } else {
          alert('해당 메뉴를 사용할 수 있는 권한이 없습니다.');
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const deleteHandler = (replyId) => {
    deleteReply(replyId)
      .then((res) => {
        if (res.status === 200) {
          alert('댓글이 삭제되었습니다.');
          getReply();
        } else {
          errorHandle(res);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const updateContentHandler = (replyId) => {
    const data = {
      replyContent: editedContent,
    };
    checkReplyCreateData(data)
      .then(() => {
        updateReply(replyId, data)
          .then((res) => {
            if (res.status === 200) {
              getReply();
              setIsEdit(false);
              alert('댓글이 수정되었습니다.');
            } else {
              errorHandle(res);
            }
          })
          .catch((e) => {
            alert('댓글 수정 실패');
            console.error(e);
          });
      })
      .catch((e) => {
        alert(e.message);
      });
  };

  const download = (filePath) => {
    showLoading();
    downloadFile(filePath)
      .then((res) => {
        if (res.status === 200) {
          return res.blob();
        } else {
          errorHandle(res);
        }
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filePath;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        hideLoading();
      });
  };

  useEffect(() => {
    if (isEdit) {
      contentEditableRef.current.focus();
    }

    //파일 조회

    getReplyFileNames(replyId)
      .then((res) => {
        setFilesData({ replyId, object: res });
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        hideLoading();
      });
  }, [isEdit]);

  const cancelHandler = () => {
    setIsEdit(false);
  };

  const handleContentChange = (e) => {
    setEditedContent(e.target.value);
  };

  return (
    <div
      className={
        isSecondDept
          ? `${styled.replyDisplay} ${styled.container}`
          : styled.replyDisplay
      }
    >
      {isSecondDept ? <div>ㄴ</div> : null}
      <div>
        <Avatar alt="프로필" src={filePath} />
      </div>
      <div style={{ flex: 1 }}>
        {' '}
        <Card
          sx={{ minWidth: 275 }}
          style={{
            backgroundColor: 'rgb(232 232 232 / 61%)',
            marginLeft: '10px',
          }}
        >
          <CardContent>
            <div className={styled.innerDisplay}>
              <div style={{ float: 'left' }}>{userName}</div>{' '}
              <div style={{ float: 'right' }}>{regdate}</div>
            </div>
            <br />
            <br />
            {isEdit ? (
              <>
                <input
                  className={styled.inputBox}
                  ref={contentEditableRef}
                  value={editedContent}
                  onChange={handleContentChange}
                />
                <CustomButton
                  size="small"
                  onClick={() => {
                    updateContentHandler(replyId);
                  }}
                >
                  수정
                </CustomButton>
                <span>|</span>
                <CustomButton
                  size="small"
                  onClick={() => {
                    cancelHandler();
                  }}
                >
                  취소
                </CustomButton>
              </>
            ) : (
              <div className={styled.div}>{content}</div>
            )}
            <div>
              {filesData.replyId === replyId
                ? filesData.object.map((ele, id) => (
                    <div key={ele.id}>
                      <span>{ele.fileName}</span>
                      <button onClick={() => download(ele.downloadFilePath)}>
                        다운로드
                      </button>
                    </div>
                  ))
                : null}
            </div>
          </CardContent>

          <div style={{ display: 'block' }}>
            {isEdit ? null : (
              <div style={{ float: 'left' }}>
                <CustomButton
                  size="small"
                  onClick={() => {
                    updateHandler(replyId);
                  }}
                >
                  수정
                </CustomButton>
                <span>|</span>
                <CustomButton
                  size="small"
                  onClick={() => {
                    deleteHandler(replyId);
                  }}
                >
                  삭제
                </CustomButton>
              </div>
            )}
            <CardActions style={{ display: 'contents' }}>
              <div className={isSecondDept ? styled.hideReplyContent : ''}>
                <div style={{ float: 'right' }}>
                  <Button
                    size="large"
                    onClick={() => {
                      handleInsertReply(index);
                    }}
                  >
                    댓글달기
                  </Button>
                </div>
              </div>
            </CardActions>
          </div>
        </Card>
      </div>
      <hr></hr>
    </div>
  );
}
