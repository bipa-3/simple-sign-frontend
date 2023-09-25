import styled from '../../../styles/components/formManage/formEdit/FormEdit.module.css';
import FormItemList from './components/FormItemList';
import getFormItem from '../../../apis/commonAPI/getFormItem';
import React, { useState, useEffect } from 'react';
import { TyniEditor, CustomButton } from '../../common/TyniEditor';

export default function FormEdit() {
  const [formData, setFormData] = useState(null);
  const [editor, setEditor] = useState(null);
  const [formItems, setFormItems] = useState([]);

  const dataHandler = (data) => {
    setFormData(data);
  };

  const editorHandler = (ref) => {
    setEditor(ref.editor);
  };

  useEffect(() => {
    console.log('formData:', formData);
  }, [formData]);

  useEffect(() => {
    getFormItem()
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setFormItems(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  return (
    <div className={styled.formEditContainer}>
      <div className={styled.categoryArea}>
        <FormItemList formItems={formItems} editor={editor} />
      </div>
      <div className={styled.editorArea}>
        <TyniEditor
          init={``}
          editorHandler={editorHandler}
          dataHandler={dataHandler}
        />
      </div>
    </div>
  );
}
