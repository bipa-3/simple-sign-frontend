import React from 'react';
import styled from '../../styles/components/UserInfo/DefaultSign.module.css';
/**
 *
 * @param {String} name 서명에 들어갈 사용자 이름 ex) name = {userData.userName}
 * @returns
 */
export default function DefaultSign({ name }) {
  return (
    <div className={styled.sign}>
      <p className={styled.default_sign}>{name}</p>
    </div>
  );
}
