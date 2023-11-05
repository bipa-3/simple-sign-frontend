import React, { useState } from 'react';
import styled from '../../styles/components/UserInfo/UserPWChange.module.css';

export default function UserPWChange({ onPwdChange }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPwdCheck, setNewPwdCheck] = useState('');

  const handleCurrentPwd = (e) => {
    setCurrentPassword(e.target.value);
    onPwdChange({ currentPassword: e.target.value, newPassword, newPwdCheck });
  };

  const handleNewPwd = (e) => {
    setNewPassword(e.target.value);
    onPwdChange({ currentPassword, newPassword: e.target.value, newPwdCheck });
  };

  const handleNewPwdCheck = (e) => {
    setNewPwdCheck(e.target.value);
    onPwdChange({ currentPassword, newPassword, newPwdCheck: e.target.value });
  };

  return (
    <div className={styled.pwcontainer}>
      <div className={styled.inputpw}>
        <input
          type="password"
          placeholder="현재 비밀번호"
          value={currentPassword}
          onChange={handleCurrentPwd}
        />
      </div>
      <div className={styled.inputpw}>
        <input
          type="password"
          placeholder="변경할 비밀번호"
          value={newPassword}
          onChange={handleNewPwd}
        />
      </div>
      <div className={styled.inputpw}>
        <input
          type="password"
          placeholder="변경할 비밀번호 확인"
          value={newPwdCheck}
          onChange={handleNewPwdCheck}
        />
      </div>
      <div>
        <ul>
          비밀번호 설정 규칙
          <li>입력 자리 수 제한 : 최소 6 / 최대 15</li>
          <li> 필수 입력 값 : 영문(대문자), 영문(소문자), 숫자, 특수문자</li>
          <li>비밀번호 변경시 결재 비밀번호도 함께 변경됩니다.</li>
        </ul>
      </div>
    </div>
  );
}
