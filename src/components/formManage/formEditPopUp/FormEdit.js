import styled from '../../../styles/components/formManage/formEdit/FormEdit.module.css';
import FormItemList from './components/FormItemList';
import getFormItem from '../../../apis/commonAPI/getFormItem';
import React, { useState, useEffect } from 'react';
import { TinyEditor } from '../../common/TinyEditor';
import ReactHtmlParser from 'html-react-parser';

export default function FormEdit({
  data,
  dataHandler,
  curForm,
  formItems,
  setFormItems,
  requiredItems,
  isModalOpen,
}) {
  const [editor, setEditor] = useState(null);
  // const [formItems, setFormItems] = useState([]);

  const formDataHandler = (data) => {
    dataHandler(data);
  };

  const editorHandler = (ref) => {
    setEditor(ref.editor);
  };

  const formItemsHandler = (data) => {
    setFormItems(data);
  };

  const checkUsedItem = (data) => {
    return data.map((ele) => {
      let buttonTag = ReactHtmlParser(ele.formListTag).props.className.split(
        ' '
      )[0];
      ele.status = curForm.includes(buttonTag + ' box') ? true : false;
      return ele;
    });
  };

  useEffect(() => {
    dataHandler(data);
    getFormItem()
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        let result = checkUsedItem(data);
        console.log(result);
        setFormItems(result);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    setFormItems(checkUsedItem(formItems));
  }, [curForm, isModalOpen]);

  return (
    <div className={styled.formEditContainer}>
      <div className={styled.categoryArea}>
        <FormItemList
          formItems={formItems}
          setFormItems={formItemsHandler}
          editor={editor}
          curForm={curForm}
          requiredItems={requiredItems}
        />
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
