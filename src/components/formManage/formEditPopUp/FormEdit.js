import styled from '../../../styles/components/formManage/formEdit/FormEdit.module.css';
import FormItemList from './components/FormItemList';
import getFormItem from '../../../apis/commonAPI/getFormItem';
import React, { useState, useEffect } from 'react';
import { TinyEditor } from '../../common/TinyEditor';
import { useLoading } from '../../../contexts/LoadingContext';

export default function FormEdit({ data, dataHandler }) {
  const [editor, setEditor] = useState(null);
  const [formItems, setFormItems] = useState([]);
  const { showLoading, hideLoading } = useLoading();

  const formDataHandler = (data) => {
    dataHandler(data);
  };

  const editorHandler = (ref) => {
    setEditor(ref.editor);
  };

  useEffect(() => {
    dataHandler(data);
    showLoading();
    getFormItem()
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setFormItems(data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        hideLoading();
      });
  }, []);
  return (
    <div className={styled.formEditContainer}>
      <div className={styled.categoryArea}>
        <FormItemList formItems={formItems} editor={editor} />
      </div>
      <div className={styled.editorArea}>
        <TinyEditor
          init={data}
          editorHandler={editorHandler}
          dataHandler={formDataHandler}
        />
      </div>
    </div>
  );
}
