import React, { useState, useRef, useEffect } from 'react';
import InnerBox from '../components/common/InnerBox';
import Button from '../components/common/Button';
import { useLocation } from 'react-router';
import { putUserInfo } from '../apis/userInfoAPl/putUserInfo';
import PopUp from '../components/common/PopUp';
import PopUpFoot from '../components/common/PopUpFoot';
import UserPWChange from '../components/userinfo/UserPWChange';
import { postPassword } from '../apis/userInfoAPl/postPassword';
import { postProfile } from '../apis/userInfoAPl/postProfile';
import { postSign } from '../apis/userInfoAPl/postSign';
import DaumPostcode from 'react-daum-postcode';
import Radio from '@mui/material/Radio';
import DefaultSign from '../components/userinfo/DefaultSign';
import styled from '../styles/pages/UpdateUserInfo.module.css';
import { useLoading } from '../contexts/LoadingContext';
import axiosErrorHandle from '../apis/error/axiosErrorHandle';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { getUserInfo } from '../apis/userInfoAPl/getUserInfo';

export default function UpdateUserInfo() {
  const location = useLocation();
  const { showLoading, hideLoading } = useLoading();

  //input 스타일 변경
  const input = useRef(null);
  const handleInputStyle = () => {
    input.current.click();
  };

  const inputSign = useRef(null);
  const handleInputSignStyle = () => {
    inputSign.current.click();
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

  const initialprofile =
    location && location.state && location.state.profile
      ? location.state.profile
      : null;

  const initialSign =
    location && location.state && location.state.sign
      ? location.state.sign
      : null;

  const [profile, setProfile] = useState(initialprofile);
  const [sign, setSign] = useState(location.state.dbSign);

  // 이미지와 사인이 없을 때
  const defaultSign = () => {
    return <div className={styled.default_image}>50x50</div>;
  };

  const renderProfile = profile ? (
    <img className={styled.profile_img} src={profile} alt="프로필" />
  ) : (
    defaultSign()
  );

  const renderSign = sign ? (
    <img src={sign} alt="사인" className={styled.sign_img} />
  ) : (
    defaultSign()
  );

  const [pwdData, setPwdData] = useState({
    currentPassword: '',
    newPassword: '',
    newPwdCheck: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const addressOpen = () => {
    setIsAddressOpen(true);
  };

  const addressClose = () => {
    setIsAddressOpen(false);
  };

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

  const address_popup_button = [
    {
      label: '취소',
      onClick: () => {
        addressClose();
      },
      btnStyle: 'light_btn',
    },
  ];

  const compData = `${userData.compName} > ${userData.estName} > ${userData.deptString}`;

  //input change
  const handleInputChange = (e, key) => {
    let value = e.target.value;

    if (key === 'phone') {
      value = value.replace(/[^0-9]/g, '');

      if (value.length > 11) {
        alert('전화번호의 최대 입력 값은 11자리까지 입니다.');
        return;
      }

      if (value.length === 10) {
        value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(
          6,
          10
        )}`;
      } else if (value.length === 11) {
        value = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(
          7,
          11
        )}`;
      }
    }

    setUserData((prevData) => ({ ...prevData, [key]: value }));
  };

  const handlePwd = (data) => {
    setPwdData(data);
  };

  // 주소
  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress +=
          extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }
    setUserData((prevData) => ({ ...prevData, address: fullAddress }));
    addressClose();
  };

  // 비밀번호 변경 api
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
        alert('비밀번호 변경에 실패했습니다. 다시 입력해주세요.');
      });
  };

  // 라디오 버튼
  const [selectedValue, setSelectedValue] = React.useState(
    initialSign === 'default' ? 'D' : 'C'
  );

  // 프로필
  const [profileFile, setProfileFile] = useState(null);

  // 서명
  const [currentSign, setCurrentSign] = useState(location.state.dbSign);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleProfileChange = (e) => {
    const file = e.target.files[0];

    if (file.type.match('image.*')) {
      if (file.size > 2 * 1024 * 1024) {
        alert('이미지 크기는 2MB까지만 넣어주세요.');
      } else {
        setProfileFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
          setProfile(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      alert('이미지 파일만 가능합니다.');
    }
  };

  const handleSignChange = (e) => {
    const file = e.target.files[0];
    if (file.type.match('image.*')) {
      if (file.size > 2 * 1024 * 1024) {
        alert('이미지 크기는 2MB까지만 넣어주세요.');
      } else {
        setCurrentSign(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setSign(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      alert('이미지 파일만 가능합니다.');
    }
  };

  // 개인정보 api 호출
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

  const updateAPI = () => {
    const promises = [];

    // 프로필 업로드
    if (profileFile) {
      const formData = new FormData();
      formData.append('file', profileFile);
      promises.push(postProfile(formData));
    }

    // 서명 업로드
    if (selectedValue) {
      const formData = new FormData();
      if (selectedValue === 'C' && currentSign) {
        formData.append('signState', 1);
        formData.append('file', currentSign);
      } else {
        formData.append('signState', 0);
      }
      promises.push(postSign(formData));
    }

    showLoading();
    // 개인 정보 업데이트
    Promise.all(promises)
      .then(() => {
        return putUserInfo(userData);
      })
      .then((response) => {
        if (response.status === 200) {
          window.location.href = `/userinfo?name=${'개인정보 조회'}`;
        }
      })
      .catch((error) => {
        axiosErrorHandle(error);
        console.log(error);
      })
      .finally(() => {
        hideLoading();
      });
  };

  return (
    <div className={styled.container}>
      <InnerBox
        width="60%"
        height="100%"
        font_size="16px"
        text={'개인정보'}
        titleChildren={
          <Button label={'저장'} btnStyle={'light_btn'} onClick={updateAPI} />
        }
        childStyle={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          marginBottom: '20px',
        }}
      >
        <div className={styled.update_user}>
          <table className={styled.update_userinfo_table}>
            <tbody>
              <tr>
                <th className={styled.userinfo_table_th}>프로필</th>
                <td>
                  <div className={styled.profile_container}>
                    <>{renderProfile}</>
                    <input
                      type="file"
                      ref={input}
                      onChange={handleProfileChange}
                      className={styled.profile_input}
                    />
                    <button
                      onClick={handleInputStyle}
                      className={styled.customInput}
                    >
                      <AttachFileIcon />
                    </button>
                  </div>
                </td>
                <th className={styled.userinfo_table_th}>서명</th>
                <td>
                  <div className={styled.sign_img_container}>
                    <div className={styled.sign_radio_container}>
                      <Radio
                        checked={selectedValue === 'D'}
                        onChange={handleChange}
                        value="D"
                        name="radio-buttons"
                        inputProps={{ 'aria-label': 'D' }}
                        style={{ color: 'rgb(108, 117, 125)' }}
                      />
                      <div className={styled.radio_button_container}>
                        <DefaultSign name={userData.userName} />
                      </div>
                    </div>
                    <div className={styled.sign_custom_container}>
                      <Radio
                        checked={selectedValue === 'C'}
                        onChange={handleChange}
                        value="C"
                        name="radio-buttons"
                        inputProps={{ 'aria-label': 'C' }}
                        style={{ color: 'rgb(108, 117, 125)' }}
                      />
                      <div className={styled.image_container}>
                        {renderSign}
                        <input
                          type="file"
                          ref={inputSign}
                          onChange={handleSignChange}
                          className={styled.sign_input}
                        />
                        <button
                          onClick={handleInputSignStyle}
                          className={styled.customInput}
                        >
                          <AttachFileIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <th className={styled.userinfo_table_th}>사번</th>
                <td>
                  <input type="text" value={userData.employeeNumber} disabled />
                </td>
                <th className={styled.userinfo_table_th}>비밀번호</th>
                <td>
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
                <td>
                  <input type="text" value={userData.userName} disabled />
                </td>
                <th className={styled.userinfo_table_th}>로그인 아이디</th>
                <td>
                  <input type="text" value={userData.loginId} disabled />
                </td>
              </tr>
              <tr>
                <th className={styled.userinfo_table_th}>이메일</th>
                <td>
                  <input type="text" value={userData.email} disabled />
                </td>
                <th className={styled.userinfo_table_th}>전화번호</th>
                <td>
                  <input
                    type="text"
                    value={userData.phone}
                    onChange={(e) => handleInputChange(e, 'phone')}
                  />
                </td>
              </tr>
              <tr>
                <th className={styled.userinfo_table_th}>생년월일</th>
                <td>
                  <input type="text" value={userData.birth} disabled />
                </td>
                <th className={styled.userinfo_table_th}>성별</th>
                <td>
                  <input
                    type="text"
                    value={userData.gender === 'M' ? '남성' : '여성'}
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <th className={styled.userinfo_table_th}>주소</th>
                <td colSpan={3} className={styled.update_user_address}>
                  <input type="text" value={userData.address} readOnly />
                  <PopUp
                    label={'주소검색'}
                    width={'500px'}
                    height={'500px'}
                    btnStyle={'grey_btn'}
                    title={'주소검색'}
                    isModalOpen={isAddressOpen}
                    openModal={addressOpen}
                    closeModal={addressClose}
                    children={
                      <>
                        <DaumPostcode onComplete={handleComplete} />
                        <PopUpFoot buttons={address_popup_button} />
                      </>
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </InnerBox>
      <InnerBox
        width="40%"
        height="100%"
        font_size="15px"
        text={'회사정보'}
        childStyle={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          marginBottom: '20px',
        }}
      >
        <table className={styled.update_userinfo_compay_table}>
          <tbody>
            <tr>
              <th className={styled.userinfo_table_th}>회사/부서</th>
              <td colSpan={3}>
                <input type="text" value={compData} disabled />
              </td>
            </tr>
            <tr>
              <th className={styled.userinfo_table_th}>직책</th>
              <td>
                <input type="text" value={userData.positionName} disabled />
              </td>
            </tr>
            <tr>
              <th className={styled.userinfo_table_th}>직급</th>
              <td>
                <input type="text" value={userData.gradeName} disabled />
              </td>
            </tr>
            <tr>
              <th className={styled.userinfo_table_th}>재직구분</th>
              <td>
                <input
                  type="text"
                  value={userData.employmentStatus === true ? '재직' : '퇴사'}
                  disabled
                />
              </td>
            </tr>
            <tr>
              <th className={styled.userinfo_table_th}>입사일</th>
              <td>
                <input type="text" value={userData.startDate} disabled />
              </td>
            </tr>
          </tbody>
        </table>
      </InnerBox>
    </div>
  );
}
