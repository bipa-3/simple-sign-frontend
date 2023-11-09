import React, { useState, useRef } from 'react';
import DragDrop from './DragDrop';
import styled from '../../../styles/components/approvalManage/approvalRegist/FileBox.module.css';
import FilePresentTwoToneIcon from '@mui/icons-material/FilePresentTwoTone';

export default function FileBox({
  id,
  files,
  fileNames,
  setFiles,
  setFileNames,
}) {
  const dragRef = useRef(null);
  const fileId = useRef(0);

  const inputFileUpload = (e) => {
    const selectFiles = e.target.files;
    Array.from(selectFiles).map((file) => {
      if (file.size > 1024 * 1024 * 10) {
        alert('파일은 10MB 이하만 삽입가능합니다.');
      } else {
        const newFile = {
          id: fileId.current++,
          object: file,
        };

        setFiles((prevFiles) => [...prevFiles, newFile]);

        const newFileName = {
          id: fileId.current++,
          name: file.name,
        };

        setFileNames((prevFileNames) => [...prevFileNames, newFileName]);
      }
    });
  };

  return (
    <div className={styled.container}>
      <div className={styled.attachNameBox}>
        <div className={styled.name}>첨부파일업로드</div>
        <input
          type="file"
          id="fileInput"
          style={{ display: 'none' }}
          multiple={true}
          onChange={inputFileUpload}
        />
        <label htmlFor={'fileInput'} ref={dragRef}>
          <div>
            <FilePresentTwoToneIcon fontSize="medium" />
          </div>
        </label>
      </div>
      <div className={styled.dataBox}>
        <div className={styled.fileContent}>
          <DragDrop
            id={id}
            files={files}
            fileNames={fileNames}
            setFiles={setFiles}
            setFileNames={setFileNames}
            dragRef={dragRef}
            fileId={fileId}
          />
        </div>
      </div>
    </div>
  );
}
