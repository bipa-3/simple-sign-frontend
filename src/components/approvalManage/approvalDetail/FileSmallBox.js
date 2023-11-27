import React, { useState, useRef } from 'react';
import { BsLink45Deg } from 'react-icons/bs';
import styled from '../../../styles/components/approvalManage/approvalDetail/ReplyBox.module.css';
import { useAlert } from '../../../contexts/AlertContext';

export default function FileBox({ files, fileNames, setFiles, setFileNames }) {
  const dragRef = useRef(null);
  const fileId = useRef(0);
  const { showAlert } = useAlert();

  const inputFileUpload = (e) => {
    const selectFiles = e.target.files;
    Array.from(selectFiles).map((file) => {
      if (file.size > 1024 * 1024 * 10) {
        showAlert({
          severity: 'error',
          message: '파일은 10MB 이하만 삽입가능합니다.',
        });
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
    <div className={styled.fileboxcontainer}>
      <input
        type="file"
        id="fileInput"
        style={{ display: 'none' }}
        multiple={true}
        onChange={inputFileUpload}
      />
      <label htmlFor={'fileInput'} ref={dragRef}>
        <div className={styled.fileboxcontainer}>
          <BsLink45Deg fontSize="20px" color="#343a40" />
        </div>
      </label>
    </div>
  );
}
