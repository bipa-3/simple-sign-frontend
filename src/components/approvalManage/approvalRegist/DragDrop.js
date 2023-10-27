import React, { useState, useEffect, useRef } from 'react';
import styled from '../../../styles/components/approvalManage/approvalRegist/DragDrop.module.css';
import { AiOutlineFileAdd } from 'react-icons/ai';

const DragDrop = ({ id, files, fileNames, setFiles, setFileNames }) => {
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

    Array.from(droppedFiles).map((file) => {
      if (file.size > 1024 * 1024 * 5) {
        alert('파일은 5MB 이하만 삽입가능합니다.');
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
