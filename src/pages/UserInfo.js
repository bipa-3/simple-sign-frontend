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
import { useAlert } from '../contexts/AlertContext';

function renderDeptString(deptString) {
  const depts = deptString.split(',');
  return depts.join(' > ');
}

export default function UserInfo() {
  const { showLoading, hideLoading } = useLoading();
  const { showAlert } = useAlert();

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

  // 비밀번호 정규식
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+]).{6,15}$/;

  // 비밀번호 변경
  const handlePwdChange = () => {
    if (pwdData.currentPassword == '') {
      showAlert({
        open: true,
        severity: 'warning',
        message: '현재 비밀번호를 입력해주세요.',
      });
      return;
    }

    if (!passwordRegex.test(pwdData.newPassword)) {
      showAlert({
        open: true,
        severity: 'warning',
        message:
          '비밀번호는 6자 이상 15자 이하이며, 영문(대문자),영문(소문자),숫자,특수문자를 포함해야 합니다.',
      });
      return;
    }

    if (pwdData.newPassword !== pwdData.newPwdCheck) {
      showAlert({
        open: true,
        severity: 'warning',
        message: '변경할 비밀번호와 비밀번호 확인이 일치하지 않습니다.',
      });
      return;
    }

    postPassword({
      currentPassword: pwdData.currentPassword,
      newPassword: pwdData.newPassword,
    })
      .then((response) => {
        if (response.status === 200) {
          showAlert({
            open: true,
            severity: 'success',
            message: '비번이 변경 되었습니다.',
          });
          closeModal();
        }
      })
      .catch((err) => {
        showAlert({
          open: true,
          severity: 'error',
          message: '비밀번호 변경에 실패했습니다.',
        });
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
      btnStyle: 'blue_btn',
    },
    {
      label: '취소',
      onClick: () => {
        closeModal();
      },
      btnStyle: 'light_btn',
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
        width="55%"
        height="100%"
        text={'개인정보'}
        font_size="16px"
        titleChildren={
          <Button
            label={'수정'}
            btnStyle={'light_btn'}
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
          marginBottom: '20px',
        }}
      >
        <table className={styled.userinfo_table}>
          <tbody>
            <tr>
              <th className={styled.userinfo_table_th}>프로필</th>
              <td className={styled.userinfo_table_td}>
                <img
                  className={styled.userinfo_profile}
                  src={profile || profileicon}
                  alt="프로필"
                />
              </td>
              <th className={styled.userinfo_table_th}>서명</th>
              <td className={styled.userinfo_table_td}>
                {sign === 'default' ? (
                  <DefaultSign name={userData.userName} />
                ) : (
                  <img className={styled.custom_sign} src={sign} alt="사인" />
                )}
              </td>
            </tr>
            <tr>
              <th className={styled.userinfo_table_th}>사번</th>
              <td className={styled.userinfo_table_td}>
                {userData.employeeNumber}
              </td>
              <th className={styled.userinfo_table_th}>비밀번호</th>
              <td className={styled.userinfo_table_td}>
                <PopUp
                  label={'비밀번호 변경'}
                  title={'비밀번호 변경'}
                  width={'400px'}
                  height={'400px'}
                  btnStyle={'dark_btn'}
                  btnWidth={'100px'}
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
              <td className={styled.userinfo_table_td}>{userData.userName}</td>
              <th className={styled.userinfo_table_th}>로그인 아이디</th>
              <td className={styled.userinfo_table_td}>{userData.loginId}</td>
            </tr>
            <tr>
              <th className={styled.userinfo_table_th}>이메일</th>
              <td className={styled.userinfo_table_td}>{userData.email}</td>
              <th className={styled.userinfo_table_th}>전화번호</th>
              <td className={styled.userinfo_table_td}>{userData.phone}</td>
            </tr>
            <tr>
              <th className={styled.userinfo_table_th}>생년월일</th>
              <td className={styled.userinfo_table_td}>{userData.birth}</td>
              <th className={styled.userinfo_table_th}>성별</th>
              <td className={styled.userinfo_table_td}>
                {userData.gender === 'M' ? '남성' : '여성'}
              </td>
            </tr>
            <tr>
              <th className={styled.userinfo_table_th}>주소</th>
              <td className={styled.userinfo_table_td} colSpan={3}>
                {userData.address}
              </td>
            </tr>
          </tbody>
        </table>
      </InnerBox>
      <InnerBox
        width="45%"
        height="100%"
        text="회사정보"
        font_size="16px"
        childStyle={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          marginBottom: '20px',
        }}
      >
        <table className={styled.userinfo_compay_table}>
          <tbody>
            <tr>
              <th className={styled.userinfo_table_th}>회사/부서</th>
              <td className={styled.userinfo_table_td} colSpan={3}>
                {userData.compName}
                {' > '}
                {userData.estName}
                {' > '}
                {renderDeptString(userData.deptString)}
              </td>
            </tr>

            <tr>
              <th className={styled.userinfo_table_th}>직책</th>
              <td className={styled.userinfo_table_td}>
                {userData.positionName}
              </td>
            </tr>
            <tr>
              <th className={styled.userinfo_table_th}>직급</th>
              <td className={styled.userinfo_table_td}>{userData.gradeName}</td>
            </tr>
            <tr>
              <th className={styled.userinfo_table_th}>재직구분</th>
              <td className={styled.userinfo_table_td}>
                {userData.employmentStatus === true ? '재직' : '퇴사'}
              </td>
            </tr>

            <tr>
              <th className={styled.userinfo_table_th}>입사일</th>
              <td className={styled.userinfo_table_td}>{userData.startDate}</td>
            </tr>
          </tbody>
        </table>
      </InnerBox>
    </div>
  );
}
