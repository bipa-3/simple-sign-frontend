import React, { useState, useEffect } from 'react';
import InnerBox from '../components/common/InnerBox';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router';
import { getUserInfo } from '../apis/userInfoAPl/getUserInfo';
import PopUp from '../components/common/PopUp';
import PopUpFoot from '../components/common/PopUpFoot';
import UserPWChange from '../components/userinfo/UserPWChange';
import { postPassword } from '../apis/userInfoAPl/postPassword';
import { getProfile } from '../apis/userInfoAPl/getProfile';
import { getSign } from '../apis/userInfoAPl/getSign';
import { getUpdateSign } from '../apis/userInfoAPl/getSign';
import styled from '../styles/pages/UserInfo.module.css';
import DefaultSign from '../components/userinfo/DefaultSign';
import { useLoading } from '../contexts/LoadingContext';
import axiosErrorHandle from '../apis/error/axiosErrorHandle';
import profileicon from '../assets/imgs/profile.png';

function renderDeptString(deptString) {
  const depts = deptString.split(',');
  return depts.join(' > ');
}

export default function UserInfo() {
  const { showLoading, hideLoading } = useLoading();

  const [pwdData, setPwdData] = useState({
    currentPassword: '',
    newPassword: '',
    newPwdCheck: '',
  });

  const handlePwd = (data) => {
    setPwdData(data);
  };

  const [userData, setUserData] = useState({
    employeeNumber: '',
    userName: '',
    loginId: '',
    email: '',
    phone: '',
    birth: '',
    gender: '',
    address: '',
    compName: '',
    estName: '',
    deptString: '',
    positionName: '',
    gradeName: '',
    employmentStatus: false,
    startDate: '',
  });

  // 팝업
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 비밀번호 변경
  const handlePwdChange = () => {
    if (pwdData.newPassword !== pwdData.newPwdCheck) {
      alert('변경할 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    postPassword({
      currentPassword: pwdData.currentPassword,
      newPassword: pwdData.newPassword,
    })
      .then((response) => {
        if (response.status === 200) {
          alert('비번이 변경 되었습니다.');
          closeModal();
        }
      })
      .catch((err) => {
        axiosErrorHandle(err);
      });
  };

  //PopUpFoot 버튼
  const popup_button = [
    {
      label: '확인',
      onClick: () => {
        handlePwdChange();
        closeModal();
      },
      btnStyle: 'popup_blue_btn',
    },
    {
      label: '취소',
      onClick: () => {
        closeModal();
      },
      btnStyle: 'popup_gray_btn',
    },
  ];

  const navigate = useNavigate();

  //api호출
  useEffect(() => {
    showLoading();
    getUserInfo()
      .then((response) => {
        setUserData(response.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        hideLoading();
      });
  }, []);

  // 프로필 api 호출
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    getProfile()
      .then((response) => {
        setProfile(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // 사인 api 호출
  const [sign, setSign] = useState(null);
  const [dbSign, setDbSign] = useState('');

  useEffect(() => {
    getSign()
      .then((response) => {
        setSign(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    getUpdateSign()
      .then((response) => {
        setDbSign(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className={styled.container}>
      <InnerBox
        style={{ width: '10%', height: '10%' }}
        text={'개인정보'}
        titleChildren={
          <Button
            label={'수정'}
            btnStyle={'gray_btn'}
            onClick={() => {
              navigate(`/updateuser?name=${'개인정보 수정'}`, {
                state: { profile, sign, dbSign },
              });
            }}
          />
        }
        childStyle={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <table>
          <tbody>
            <tr>
              <th className={styled.userinfo_table_th}>프로필</th>
              <td>
                <img
                  className={styled.userinfo_profile}
                  src={profile || profileicon}
                  alt="프로필"
                />
              </td>
              <th className={styled.userinfo_table_th}>서명</th>
              <td>
                {sign === 'default' ? (
                  <DefaultSign name={userData.userName} />
                ) : (
                  <img className={styled.custom_sign} src={sign} alt="사인" />
                )}
              </td>
            </tr>
            <tr>
              <th className={styled.userinfo_table_th}>사번</th>
              <td>{userData.employeeNumber}</td>
              <th className={styled.userinfo_table_th}>비밀번호</th>
              <td>
                <PopUp
                  label={'비밀번호 변경'}
                  title={'비밀번호 변경'}
                  width={'400px'}
                  height={'400px'}
                  isModalOpen={isModalOpen}
                  openModal={openModal}
                  closeModal={closeModal}
                  children={
                    <>
                      <UserPWChange onPwdChange={handlePwd} />
                      <PopUpFoot buttons={popup_button} />
                    </>
                  }
                />
              </td>
            </tr>
            <tr>
              <th className={styled.userinfo_table_th}>이름</th>
              <td>{userData.userName}</td>
              <th className={styled.userinfo_table_th}>로그인아이디</th>
              <td>{userData.loginId}</td>
            </tr>
            <tr>
              <th className={styled.userinfo_table_th}>이메일</th>
              <td>{userData.email}</td>
              <th className={styled.userinfo_table_th}>전화번호</th>
              <td>{userData.phone}</td>
            </tr>
            <tr>
              <th className={styled.userinfo_table_th}>생년월일</th>
              <td>{userData.birth}</td>
              <th className={styled.userinfo_table_th}>성별</th>
              <td>{userData.gender === 'M' ? '남성' : '여성'}</td>
            </tr>
            <tr>
              <th className={styled.userinfo_table_th}>주소</th>
              <td colSpan={3}>{userData.address}</td>
            </tr>
          </tbody>
        </table>
      </InnerBox>
      <InnerBox
        style={{ width: '10%', height: '10%' }}
        text={'회사정보'}
        childStyle={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <table>
          <tbody>
            <tr>
              <th className={styled.userinfo_table_th}>회사/부서</th>
              <td colSpan={3}>
                {userData.compName}
                {' > '}
                {userData.estName}
                {' > '}
                {renderDeptString(userData.deptString)}
              </td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <th className={styled.userinfo_table_th}>직책</th>
              <td>{userData.positionName}</td>
              <th className={styled.userinfo_table_th}>직급</th>
              <td>{userData.gradeName}</td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <th className={styled.userinfo_table_th}>재직구분</th>
              <td>{userData.employmentStatus === true ? '재직' : '퇴사'}</td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <th className={styled.userinfo_table_th}>입사일</th>
              <td>{userData.startDate}</td>
            </tr>
          </tbody>
        </table>
      </InnerBox>
    </div>
  );
}
