import styled from '../../../../styles/components/formManage/formEdit/components/FormList.module.css';
import React, { useState, useEffect } from 'react';
import { CustomButton } from '../../../common/TinyEditor';
import ReactHtmlParser from 'html-react-parser';

export default function FormItemList({
  formItems,
  setFormItems,
  editor,
  curForm,
}) {
  const [searchText, SetSearchText] = useState('');

  const searchTexthandler = (e) => {
    SetSearchText(e.target.value);
  };

  // useEffect(() => {
  //   let checkClass = formItems.map((ele) => {
  //     let buttonTag = ReactHtmlParser(ele.formListTag).props.className.split(
  //       ' '
  //     )[0];
  //     ele.status = curForm.includes(buttonTag) ? true : false;
  //     return ele;
  //   });
  //   setFormItems(checkClass);
  // }, [formItems, curForm]);

  return (
    <div className={styled.formListContainer}>
      <div className={styled.searchArea}>
        <input
          type="text"
          placeholder="검색할 항목을 입력하세요..."
          onChange={searchTexthandler}
          className={styled.inputStyle}
        />
      </div>
      <hr />
      <div className={styled.formListArea}>
        {formItems
          .filter((ele) => ele.formListName.includes(searchText))
          .map((ele) => {
            return (
              <CustomButton
                key={ele.formListName}
                label={ele.formListName}
                editor={editor}
                text={ele.formListTag}
                disadledStatus={ele.status}
              ></CustomButton>
            );
          })}
      </div>
    </div>
  );
}
