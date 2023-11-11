import styled from '../../../styles/components/formManage/formEdit/FormEdit.module.css';
import FormItemList from './components/FormItemList';
import getFormItem from '../../../apis/formManageAPI/getFormItem';
import React, { useState, useEffect } from 'react';
import { TinyEditor } from '../../common/TinyEditor';
import ReactHtmlParser from 'html-react-parser';
import Button from '../../common/Button';
import { useFormManage } from '../../../contexts/FormManageContext';

export default function FormEdit({
  id,
  data,
  dataHandler,
  curForm,
  formItems,
  setFormItems,
  requiredItems,
  isModalOpen,
  isDefaultButton,
}) {
  const [editor, setEditor] = useState(null);
  const { detailData } = useFormManage();
  let contentStyled = isDefaultButton
    ? styled.contentArea
    : styled.contentMainArea;

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
    if (!isModalOpen) {
      editor?.setContent(detailData[id]);
    }
  }, [isModalOpen]);

  const defualt_template = () => {
    let template = `<h1 data-mce-style="text-align: center;" style="text-align: center;">결재 문서</h1>
    <table border="1" style="width: 100%; height: 324.836px;"><colgroup><col style="width: 18.7364%;"><col style="width: 81.2636%;"></colgroup><tbody>
    <tr style="height: 45.9883px;"><td style="height: 45.9883px;" colspan="2"><div id="approval_line" class="approval_line box" contenteditable="false">결재라인</div></td></tr><tr style="height: 20px;">
    <td style="text-align: center; height: 20px;"><strong>문서번호</strong></td><td style="height: 20px;"><div id="doc_num" class="doc_num box" contenteditable="false">문서번호</div></td></tr><tr style="height: 20px;">
    <td style="text-align: center; height: 20px;"><strong>제목</strong></td><td style="height: 20px;"><div id="form_title" class="form_title box" contenteditable="false">제목</div></td></tr><tr style="height: 20px;">
    <td style="text-align: center; height: 20px;"><strong>기안자</strong></td><td style="height: 20px;"><div id="drafter" class="drafter box" contenteditable="false">기안자</div></td></tr><tr style="height: 20px;">
    <td style="text-align: center; height: 20px;"><strong>기안일</strong></td><td style="height: 20px;"><div id="drafting_time" class="drafting_time box" contenteditable="false">기안일</div></td></tr><tr style="height: 20px;">
    <td style="text-align: center; height: 20px;"><strong>기안자부서</strong></td><td style="height: 20px;"><div id="drafter_dept" class="drafter_dept box" contenteditable="false">기안자 부서</div></td></tr><tr style="height: 20px;">
    <td style="text-align: center; height: 20px;"><strong>수신참조</strong></td><td style="height: 20px;"><div id="rec_ref" class="rec_ref box" contenteditable="false">수신및참조</div></td></tr><tr style="height: 20px;"><td style="text-align: center; height: 20px;"><strong>시행일자</strong>
    </td><td style="height: 20px;"><div id="enforce_date" class="enforce_date box" contenteditable="false">시행일자</div></td></tr><tr style="height: 41.8555px;"><td colspan="2" style="height: 41.8555px; text-align: center;">
    <strong>내용</strong></td></tr><tr style="height: 96.9922px;"><td colspan="2" style="height: 96.9922px;"><div id="content" class="contents box" contenteditable="false">내용</div></td></tr></tbody></table>
    `;
    // dataHandler(template);
    editor.setContent(template);
  };

  useEffect(() => {
    setFormItems(checkUsedItem(formItems));
  }, [curForm, isModalOpen]);

  return (
    <div className={styled.formEditContainer}>
      {isDefaultButton ? (
        <div className={styled.optionsArea}>
          <div className={styled.optionTitleBox}>{'기본 템플릿'}</div>
          <div className={styled.optionsBox}>
            <Button
              onClick={defualt_template}
              width={'100px'}
              fontSize={'12px'}
              label={'기본 템플릿 적용'}
              btnStyle={'gray_btn'}
            />
          </div>
        </div>
      ) : null}
      <div className={contentStyled}>
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
    </div>
  );
}
