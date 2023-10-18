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
    </div>
  );
}
