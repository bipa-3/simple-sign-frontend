import React, { useState } from 'react';
import InnerBox from '../components/common/InnerBox';
import Button from '../components/common/Button';
import { useNavigate, useLocation } from 'react-router';
import putUserInfo from '../apis/userInfoAPl/putUserInfo';
import PopUp from '../components/common/PopUp';
import PopUpFoot from '../components/common/PopUpFoot';
import UserPWChange from '../components/userinfo/UserPWChange';
import postPassword from '../apis/userInfoAPl/postPassword';
import { postProfile } from '../apis/userInfoAPl/postProfile';
import { postSign } from '../apis/userInfoAPl/postSign';
import DaumPostcode from 'react-daum-postcode';
import Radio from '@mui/material/Radio';
import styled from '../styles/pages/UpdateUserInfo.module.css';

export default function UpdateUserInfo() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialUserData = {
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
  };

  const userDataFromLocation =
    location && location.state && location.state.userData
      ? location.state.userData
      : initialUserData;

  const initialprofile =
    location && location.state && location.state.profile
      ? location.state.profile
      : null;

  const initialSign =
    location && location.state && location.state.sign
      ? location.state.sign
      : null;

  const [userData, setUserData] = useState(userDataFromLocation);
  const [profile, setProfile] = useState(initialprofile);
  const [sign, setSign] = useState(location.state.dbSign);

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

  const address_popup_button = [
    {
      label: '취소',
      onClick: () => {
        addressClose();
      },
      btnStyle: 'popup_gray_btn',
    },
  ];

  const compData = `${userData.compName} > ${userData.estName} > ${userData.deptString}`;

  //input change
  const handleInputChange = (e, key) => {
    setUserData((prevData) => ({ ...prevData, [key]: e.target.value }));
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
      .catch(() => {
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
    setProfileFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSignChange = (e) => {
    const file = e.target.files[0];
    setCurrentSign(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setSign(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

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

    // 개인 정보 업데이트
    Promise.all(promises)
      .then(() => {
        return putUserInfo(userData);
      })
      .then((response) => {
        if (response.status === 200) {
          navigate('/userinfo');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <InnerBox
        style={{ width: '10%', height: '10%' }}
        text={'개인정보'}
        titleChildren={
          <Button label={'저장'} btnStyle={'gray_btn'} onClick={updateAPI} />
        }
      >
        <table>
          <tbody>
            <tr>
              <th className={styled.userinfo_table_th}>프로필</th>
              <td>
                <div className={styled.profile_container}>
                  <img
                    className={styled.profile_img}
                    src={profile}
                    alt="프로필"
                  />
                  <input type="file" onChange={handleProfileChange} />
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
                    />
                    <div>
                      <p className={styled.default_sign}>{userData.userName}</p>
                    </div>
                  </div>
                  <div className={styled.sign_custom_container}>
                    <Radio
                      checked={selectedValue === 'C'}
                      onChange={handleChange}
                      value="C"
                      name="radio-buttons"
                      inputProps={{ 'aria-label': 'C' }}
                    />
                    <img src={sign} alt="사인" className={styled.sign_img} />
                    <input
                      type="file"
                      onChange={handleSignChange}
                      className={styled.sign_input}
                    />
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
          <tbody>
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
                  width={'300px'}
                  height={'300px'}
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
          </tbody>
          <tbody>
            <tr>
              <th className={styled.userinfo_table_th}>이름</th>
              <td>
                <input type="text" value={userData.userName} disabled />
              </td>
              <th className={styled.userinfo_table_th}>로그인아이디</th>
              <td>
                <input type="text" value={userData.loginId} disabled />
              </td>
            </tr>
          </tbody>
          <tbody>
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
          </tbody>
          <tbody>
            <tr>
              <th className={styled.userinfo_table_th}>생년월일</th>
              <td>
                <input type="text" value={userData.birth} disabled />
              </td>
              <th className={styled.userinfo_table_th}>성별</th>
              <td>
                <input type="text" value={userData.gender} disabled />
              </td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <th className={styled.userinfo_table_th}>주소</th>
              <td colSpan={3}>
                <input type="text" value={userData.address} readOnly />
                <PopUp
                  label={'주소검색'}
                  width={'500px'}
                  height={'500px'}
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
      </InnerBox>
      <div className={styled.usercompany}></div>
      <InnerBox style={{ width: '10%', height: '10%' }} text={'회사정보'}>
        <table>
          <tbody>
            <tr>
              <th className={styled.userinfo_table_th}>회사/부서</th>
              <td colSpan={3}>
                <input type="text" value={compData} disabled />
              </td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <th className={styled.userinfo_table_th}>직책</th>
              <td>
                <input type="text" value={userData.positionName} disabled />
              </td>
              <th className={styled.userinfo_table_th}>직급</th>
              <td>
                <input type="text" value={userData.gradeName} disabled />
              </td>
            </tr>
          </tbody>
          <tbody>
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
          </tbody>
          <tbody>
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
