import React, { useState } from 'react';
import Button from '../../common/Button';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import styled from '../../../styles/components/approvalManage/approvalDetail/ReplyBox.module.css';
import { styled as MUIStyled } from '@mui/material';
import FileSmallBox from './FileSmallBox';

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
    <div className={styled.replyBoxcontainer}>
      <div className={styled.replycontainer}>
        <textarea
          placeholder="댓글을 입력하세요"
          ref={replyRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div className={styled.btnarea}>
          <FileSmallBox
            files={files}
            setFiles={setFiles}
            fileNames={fileNames}
            setFileNames={setFileNames}
          />

          <Button
            className={styled.insertBoxArea}
            label={'등록'}
            btnStyle={'green_btn'}
            height="36px"
            width="52px"
            fontSize="12.4px"
            onClick={() => {
              handleReplyInsert(replyId, index, groupNo);
            }}
          />
        </div>
      </div>
      {fileNames.length !== 0
        ? fileNames.map((file) => {
            return <div className={styled.files}>첨부파일 : {file.name}</div>;
          })
        : null}
    </div>
  );
}
