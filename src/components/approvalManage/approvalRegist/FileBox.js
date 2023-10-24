import React, { useState } from 'react';
import DragDrop from './DragDrop';
import styled from '../../../styles/components/approvalManage/approvalRegist/FileBox.module.css';
import Button from '../../../components/common/Button';
import AttachFileIcon from '@mui/icons-material/AttachFile';

export default function FileBox({
  id,
  files,
  fileNames,
  setFiles,
  setFileNames,
  dataHandler,
}) {
  return (
    <div className={styled.container}>
      <div className={styled.attachNameBox}>
        <div className={styled.name}>첨부파일업로드</div>
        <div>
          <Button
            height={'30px'}
            width={'50px'}
            label={<AttachFileIcon />}
            btnStyle={'clip_non_btn'}
          />
        </div>
      </div>
      <div className={styled.dataBox}>
        <div className={styled.fileContent}>
          <DragDrop
            id={id}
            files={files}
            fileNames={fileNames}
            setFiles={setFiles}
            setFileNames={setFileNames}
            dataHandler={dataHandler}
          />
        </div>
      </div>
    </div>
  );
}
