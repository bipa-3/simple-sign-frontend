import React, { useState, useEffect, useRef } from 'react';
import styled from '../../../styles/components/approvalManage/approvalRegist/DragDrop.module.css';
import { AiOutlineFileAdd } from 'react-icons/ai';
import HighlightAltTwoToneIcon from '@mui/icons-material/HighlightAltTwoTone';
import { useAlert } from '../../../contexts/AlertContext';

const DragDrop = ({
  id,
  files,
  fileNames,
  setFiles,
  setFileNames,
  dragRef,
  fileId,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const { showAlert } = useAlert();

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
      if (file.size > 1024 * 1024 * 10) {
        showAlert({
          severity: 'warn',
          message: '파일은 10MB 이하만 삽입 가능합니다.',
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

    setIsDragging(false);
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
      <div className={styled.display}>
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
            <HighlightAltTwoToneIcon />
          </div>
        )}
      </div>
    </div>
  );
};

export default DragDrop;
