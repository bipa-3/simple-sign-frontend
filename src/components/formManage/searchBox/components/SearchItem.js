import styled from '../../../../styles/components/formManage/searchBox/components/SearchItem.module.css';
import SearchDate from '../../../approvalBox/SearchDate';
import React from 'react';

const ItemBox = ({ children }) => {
  return <div className={styled.itemBox}>{children}</div>;
};

const TextComp = ({ text }) => {
  return <p className={styled.title}>{text}</p>;
};

const InputComp = ({ id, dataHandler, width, placeholder }) => {
  return (
    <div className={styled.inputBox} style={{ width: `${width}` }}>
      <input
        className={styled.input}
        style={{ width: `${width}` }}
        type="text"
        placeholder={placeholder}
        onChange={(e) => {
          dataHandler(id, e.target.value);
        }}
      />
    </div>
  );
};

const SelectComp = ({ id, width, options, dataHandler, values }) => {
  return (
    <select
      className={styled.select}
      style={{ width: `${width}` }}
      value={values}
      onChange={(e) => {
        dataHandler(id, parseInt(e.target.value));
      }}
    >
      {options
        ? options.map((ele, index) => {
            return (
              <option key={index} value={ele.seqCode ? ele.seqCode : ele.id}>
                {ele.name}
              </option>
            );
          })
        : null}
    </select>
  );
};

const DateComp = (dataHandler) => {
  return <SearchDate />;
};

export { ItemBox, TextComp, InputComp, DateComp, SelectComp };
