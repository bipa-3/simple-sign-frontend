import React, { useState, useEffect, useRef } from 'react';
import styled from '../../../styles/components/approvalManage/approvalDetail/ReplyDetail.module.css';
// import Button from '../../common/Button';
import { Avatar } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { styled as MUIStyled } from '@mui/material';
import { json } from 'react-router-dom';
import getIsEditReply from '../../../apis/approvalManageAPI/getIsEditReply';
import deleteReply from '../../../apis/approvalManageAPI/deleteReply';
import updateReply from '../../../apis/approvalManageAPI/updateReply';
import errorHandle from '../../../apis/errorHandle';

const CustomButton = MUIStyled(Button)({
  width: '0.5em',
  '&.MuiButton-sizeSmall': {
    minWidth: '50px',
  },
});

export default function ReplyDetail({
  replyId,
  user,
  regdate,
  content,
  groupOrd,
  groupNo,
  index,
  isSecondDept,
  handleInsertReply,
}) {
  const contentEditableRef = useRef(content);
  const [isEdit, setIsEdit] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const updateHandler = () => {
    //권한가져오고 권한이 있으면 contentEditable로 바꿔주기
    getIsEditReply(replyId)
      .then((res) => {
        setIsEdit(res);
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
        } else {
          errorHandle(res);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const updateContentHandler = (replyId) => {
    // console.log(editedContent);
    // console.log(replyId);
    const data = {
      replyContent: editedContent,
    };
    updateReply(replyId, data)
      .then((res) => {
        if (res.status === 200) {
          alert('댓글이 수정되었습니다.');
        } else {
          errorHandle(res);
        }
      })
      .catch((e) => {
        alert('댓글 수정 실패');
        console.error(e);
      });
  };

  useEffect(() => {
    if (isEdit) {
      contentEditableRef.current.focus();
    }
  });

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
        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
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
              <div style={{ float: 'left' }}>{user}</div>{' '}
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
