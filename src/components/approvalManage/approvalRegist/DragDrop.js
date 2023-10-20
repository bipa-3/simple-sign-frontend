import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled from '../../../styles/components/formManage/formDetail/components/DragDrop.module.css';
import { AiOutlineFileAdd } from 'react-icons/ai';

const DragDrop = ({ id, name, data, dataHandler }) => {
  const fileId = useRef(0);
  const dragRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);

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

    onChangeFiles(e);
    setIsDragging(false);
  };

  const inputFileUpload = (e) => {
    onChangeFiles(e);
  };

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

  const onChangeFiles = (e) => {
    let selectFiles = [];
    let tempFiles = files;

    if (e.type === 'drop') {
      selectFiles = e.dataTransfer.files;
    } else {
      selectFiles = e.target.files;
    }
    for (const file of selectFiles) {
      tempFiles = [
        {
          id: fileId.current++,
          object: file,
        },
      ];
    }
    setFiles(tempFiles);
  };

  useEffect(() => {
    const modifiedBlob = new Blob([data], {
      type: 'text/html',
    });
    const modifiedFile = new File([modifiedBlob], `${name}.html`);
    let defaultFile = [
      {
        id: fileId.current++,
        object: modifiedFile,
      },
    ];
    initDragEvents();
    setFiles(defaultFile);
    return () => resetDragEvents();
  }, []);

  const getFileContent = () => {
    if (files.length > 0) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const fileContent = event.target.result;
        dataHandler(id, fileContent);
      };
      reader.readAsText(files[0].object);
    }
  };

  useEffect(() => {
    getFileContent();
  }, [files]);

  return (
    <div>
      <input
        type="file"
        id={name}
        style={{ display: 'none' }}
        multiple={true}
        accept=".png"
        onChange={inputFileUpload}
      />

      <label
        className={
          isDragging ? styled.dragDropFileDragging : styled.dragDropFile
        }
        htmlFor={name}
        ref={dragRef}
      >
        <div>
          <AiOutlineFileAdd />
        </div>
      </label>
    </div>
  );
};

export default DragDrop;
