import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import styled from '../../styles/components/common/Selectbox.module.css';
import { useState, useEffect } from 'react';

export default function SelectBox({
  selectList,
  width,
  height,
  onChange,
  init,
}) {
  const [selectedValue, setSelectedValue] = useState(
    selectList.length > 0 ? selectList[0].seqCode : init
  );

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(selectedValue);
    }
  }, [selectedValue, onChange]);
  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 50 }}>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          className={styled.selectBox}
          style={{ width: `${width}px`, height: `${height}px` }}
          value={init || selectedValue}
          onChange={(event) => setSelectedValue(event.target.value)} // 값 변경 시 호출될 콜백 함수
        >
          {!selectList.isEmpty
            ? selectList.map((ele, index) => {
                return (
                  <MenuItem
                    key={index}
                    value={ele.seqCode}
                    className={styled.selectmenu}
                  >
                    {ele.name}
                  </MenuItem>
                );
              })
            : null}
        </Select>
      </FormControl>
    </div>
  );
}
