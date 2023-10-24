import React, { useState, useEffect, useRef } from 'react';
import styled from '../../../styles/components/approvalManage/approvalRegist/DragDrop.module.css';
import { AiOutlineFileAdd } from 'react-icons/ai';

const DragDrop = ({
  id,
  files,
  fileNames,
  setFiles,
  setFileNames,
  dataHandler,
}) => {
  console.log(files);
  const fileId = useRef(0);
  const dragRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);

  const initDragEvents = () => {
    if (dragRef.current !== null) {
      dragRef.current.addEventListener('dragenter', handleDragIn);
      dragRef.current.addEventListener('dragleave', handleDragOut);
      dragRef.current.addEventListener('dragover', handleDragOver);
      dragRef.current.addEventListener('drop', handleDrop);
    }
  };

  const resetDragEvents = () => {
    if (dragRef.current !== null) {
      dragRef.current.removeEventListener('dragenter', handleDragIn);
      dragRef.current.removeEventListener('dragleave', handleDragOut);
      dragRef.current.removeEventListener('dragover', handleDragOver);
      dragRef.current.removeEventListener('drop', handleDrop);
    }
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFiles = e.dataTransfer.files;
    console.log(droppedFiles);
    const newFiles = Array.from(droppedFiles).map((file) => ({
      id: fileId.current++,
      object: file,
    }));
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);

    const newFileNames = Array.from(droppedFiles).map((file) => ({
      id: fileId.current++,
      name: file.name,
    }));
    setFileNames((prevFileNames) => [...prevFileNames, ...newFileNames]);

    setIsDragging(false);
  };

  const inputFileUpload = (e) => {
    const selectFiles = e.target.files;
    const newFiles = Array.from(selectFiles).map((file) => ({
      id: fileId.current++,
      object: file,
    }));

    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);

    const fileNames = updatedFiles.map((file) => file.object.name);
    setFileNames(fileNames);
  };

  useEffect(() => {
    initDragEvents();

    return () => resetDragEvents();
  }, []);

  useEffect(() => {
    getFileContent();
  }, [files]);

  const getFileContent = () => {
    console.log(files);

    files.map((file, index) => {
      dataHandler(index, file);
    });
    // 모든 파일의 내용을 읽어온 뒤 dataHandler 함수를 호출
    // Promise.all(readers)
    //   .then((fileContents) => {
    //     // fileContents는 [{ file: File, content: string }, ...] 형태의 배열
    //     // dataHandler 함수를 사용하여 파일 내용을 처리하거나 저장
    //     dataHandler(id, fileContents);
    //   })
    //   .catch((error) => {
    //     // 에러 처리: 파일 읽기 중에 오류가 발생한 경우
    //     console.error('파일 읽기 오류:', error);
    //   });
  };

  return (
    <div
      className={isDragging ? styled.dragDropFileDragging : styled.dragDropFile}
      ref={dragRef}
    >
      <input
        type="file"
        style={{ display: 'none' }}
        multiple={true}
        onChange={inputFileUpload}
      />

      <div className={styled.display}>
        {console.log(fileNames)}
        {fileNames.length > 0 ? (
          <>
            {fileNames.map((file, index) => (
              <div className={styled.file} key={index}>
                {file.name}
              </div>
            ))}
          </>
        ) : (
          <div className={styled.logo}>
            <AiOutlineFileAdd />
          </div>
        )}
      </div>
    </div>
  );
};

export default DragDrop;
