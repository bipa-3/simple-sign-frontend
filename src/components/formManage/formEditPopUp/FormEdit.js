import styled from '../../../styles/components/formManage/formEdit/FormEdit.module.css';
import FormItemList from './components/FormItemList';
import getFormItem from '../../../apis/commonAPI/getFormItem';
import React, { useState, useEffect } from 'react';
import { TinyEditor } from '../../common/TinyEditor';
import ReactHtmlParser from 'html-react-parser';

export default function FormEdit({ data, dataHandler, curForm }) {
  const [editor, setEditor] = useState(null);
  const [formItems, setFormItems] = useState([]);

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
      ele.status = curForm.includes(buttonTag) ? true : false;
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
        setFormItems(checkUsedItem(data));
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    setFormItems(checkUsedItem(formItems));
  }, [curForm]);

  return (
    <div className={styled.formEditContainer}>
      <div className={styled.categoryArea}>
        <FormItemList
          formItems={formItems}
          setFormItems={formItemsHandler}
          editor={editor}
          curForm={curForm}
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
