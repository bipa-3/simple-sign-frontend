import styled from '../../../styles/pages/ApprovalBoxSetPage.module.css';
import React from 'react';
import Optionbox from '../../common/Optionbox';

export default function AreaBox({ id, data, dataHandler, children }) {
  return (
    <div className={styled.dataBox}>
      <div className={styled.viewUseField}>
        <div className={styled.viewItemBox}>
          {data.length > 0
            ? data.map((ele, index) => {
                return (
                  <Optionbox
                    key={index}
                    id={id}
                    initData={ele}
                    dataHandler={dataHandler}
                  ></Optionbox>
                );
              })
            : null}
        </div>
        {children}
      </div>
    </div>
  );
}
