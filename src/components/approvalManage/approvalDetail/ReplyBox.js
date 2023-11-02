import React, { useState } from 'react';
import Button from '../../common/Button';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import styled from '../../../styles/components/approvalManage/approvalDetail/ReplyBox.module.css';
import { styled as MUIStyled } from '@mui/material';
import FileSmallBox from './FileSmallBox';

const CustomTextArea = MUIStyled(TextareaAutosize)({
  minHeight: '40px',
  width: '70%',
});
export default function ReplyBox({
  replyRef,
  replyId,
  groupNo,
  index,
  handleReplyInsert,
  files,
  setFiles,
  fileNames,
  setFileNames,
  inputValue,
  setInputValue,
}) {
  return (
    <div>
      <CustomTextArea
        placeholder="댓글을 입력하세요"
        ref={replyRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button
        className={styled.insertBoxArea}
        label={'등록'}
        btnStyle={'blue_btn'}
        onClick={() => {
          handleReplyInsert(replyId, index, groupNo);
        }}
      />
      <FileSmallBox
        files={files}
        setFiles={setFiles}
        fileNames={fileNames}
        setFileNames={setFileNames}
      />
      {fileNames.length !== 0
        ? fileNames.map((file) => {
            return <div>{file.name}</div>;
          })
        : null}
    </div>
  );
}
