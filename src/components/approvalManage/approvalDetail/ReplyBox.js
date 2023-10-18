import React from 'react';
import Button from '../../common/Button';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import styled from '../../../styles/components/approvalManage/approvalDetail/ReplyBox.module.css';
import { styled as MUIStyled } from '@mui/material';

const CustomTextArea = MUIStyled(TextareaAutosize)({
  minHeight: '40px',
  width: '70%',
});
export default function ({
  replyRef,
  replyId,
  groupNo,
  index,
  handleReplyInsert,
}) {
  return (
    <div>
      <CustomTextArea placeholder="댓글을 입력하세요" ref={replyRef} />
      <Button
        className={styled.insertBoxArea}
        label={'등록'}
        btnStyle={'blue_btn'}
        onClick={() => {
          handleReplyInsert(replyId, index, groupNo);
        }}
      />
    </div>
  );
}
