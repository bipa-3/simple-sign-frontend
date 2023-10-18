import styled from '../../../../styles/components/formManage/formEdit/components/FormList.module.css';
import React, { useState } from 'react';
import { CustomButton } from '../../../common/TinyEditor';

export default function FormItemList({ formItems, editor }) {
  const [searchText, SetSearchText] = useState('');

  const searchTexthandler = (e) => {
    SetSearchText(e.target.value);
  };

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
              ></CustomButton>
            );
          })}
      </div>
    </div>
  );
}
