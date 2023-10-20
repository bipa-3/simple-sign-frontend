import React, { useRef, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import styled from '../../styles/components/formManage/formEdit/components/FormList.module.css';

export const CustomButton = ({ label, editor, text }) => {
  const handleInsertDiv = () => {
    if (editor) {
      const test = text || '';
      editor.execCommand('mceInsertContent', false, test);
    }
  };

  return (
    <button className={styled.customBtnStyle} onClick={handleInsertDiv}>
      {label}
    </button>
  );
};

export function TinyEditor({ init, editorHandler, dataHandler }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef) {
      editorHandler(editorRef.current);
    }
  }, [editorRef, editorHandler]);

  return (
    <>
      <Editor
        onEditorChange={dataHandler}
        initialValue={init || ''}
        init={{
          height: '100%',
          menubar: false,
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'preview',
            'wordcount',
            'image',
          ],
          toolbar:
            'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | table | image ',
          content_css: 'assets/editor_style.css',
          statusbar: false,
        }}
        ref={editorRef}
      />
    </>
  );
}
