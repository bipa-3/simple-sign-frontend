import React, { useEffect, useState } from 'react';
import InnerBox from '../../../components/common/InnerBox';
import Button from '../../../components/common/Button';
import DetailForm from './DetailForm';
import { useLocation, useNavigate } from 'react-router-dom';
import PopUp from '../../common/PopUp';
import PopUpFoot from '../../common/PopUpFoot';
import insertApproval from '../../../apis/approvalManageAPI/insertApproval';
import insertReturn from '../../../apis/approvalManageAPI/insertReturn';
import insertCancel from '../../../apis/approvalManageAPI/insertCancel';
import insertPassword from '../../../apis/approvalManageAPI/insertPassword';
import deleteApprovalDoc from '../../../apis/approvalManageAPI/deleteApprovalDoc';
import { useLoading } from '../../../contexts/LoadingContext';
import ReplyForm from './ReplyForm';
import { usePage } from '../../../contexts/PageContext';
import getHasApproval from '../../../apis/approvalManageAPI/getHasApproval';
import getPermissionList from '../../../apis/approvalManageAPI/getPermissionList';
import getHasUpdate from '../../../apis/approvalManageAPI/getHasUpdate';
import getHasDelete from '../../../apis/approvalManageAPI/getHasDelete';
import styled from '../../../styles/components/approvalManage/approvalDetail/ApprovalDetail.module.css';
import errorHandle from '../../../apis/errorHandle';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import ContentPasteOffOutlinedIcon from '@mui/icons-material/ContentPasteOffOutlined';
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined';
import { green, red, grey } from '@mui/material/colors';

export default function ApprovalDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState('');
  const { showLoading, hideLoading } = useLoading();
  const { state: pageState, setState: setPageState } = usePage();
  const [hasPermission, setHasPermission] = useState(false);
  const [hasApproval, setHasApproval] = useState(false);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [hasDelete, setHasDelete] = useState(false);
  const [isTemporal, setIsTemporal] = useState(false);
  const [password, setPassword] = useState('');
  const [formName, setFormName] = useState('');
  const [reload, setReload] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const approvalDocId = queryParams.get('page');

  const openModal = (mode) => {
    setIsModalOpen(true);
    if (mode === 'approve') {
      setMode('승인');
    } else if (mode === 'return') {
      setMode('반려');
    } else if (mode === 'cancel') {
      setMode('취소');
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const passwordChange = (e) => {
    setPassword(e.target.value);
  };

  useEffect(() => {
    getHasPermission();
  }, [reload]);

  //권한목록 가져와서 해당 사용자가 있으면 버튼 노출
  const getHasPermission = () => {
    if (!isTemporal) {
      //console.log(sessionStorage.getItem('user')); //해당 사용자 권한 가져오기
      //승인/반려 권한 가져오기
      getPermissionList(approvalDocId).then((res) => {
        //console.log(res);
        setHasPermission(res);
      });

      //결재취소권한 가져오기
      getHasApproval(approvalDocId).then((res) => {
        setHasApproval(res);
      });
    }

    //문서수정권한 가져오기
    getHasUpdate(approvalDocId).then((res) => {
      setHasUpdate(res);
    });

    //문서삭제권한 가져오기
    getHasDelete(approvalDocId).then((res) => {
      setHasDelete(res);
    });
  };

  const approveHandler = (mode) => {
    setPageState({ ...pageState, curPage: '결재상세' });
    showLoading();
    // 비밀번호 확인
    insertPassword(password)
      .then((passwordRes) => {
        if (passwordRes.status === 200) {
          if (mode === '승인') {
            // 비밀번호가 일치하는 경우에만 결재 승인 수행
            localStorage.setItem('approvalState', '');
            localStorage.setItem('approvalState', 'send');
            return insertApproval(approvalDocId);
          } else if (mode === '반려') {
            localStorage.setItem('approvalState', '');
            localStorage.setItem('approvalState', 'reject');

            return insertReturn(approvalDocId);
          } else if (mode === '취소') {
            localStorage.setItem('approvalState', '');
            localStorage.setItem('approvalState', 'cancel');
            return insertCancel(approvalDocId);
          }
        } else {
          errorHandle(passwordRes);
        }
      })
      .then((approvalRes) => {
        if (approvalRes.status === 200) {
          alert(`결재가 ${mode}되었습니다.`);
          setReload(!reload);
          //window.location.reload();
        } else {
          errorHandle(approvalRes);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        hideLoading();
      });
  };

  const returnTitleComponent = () => {
    return hasPermission ? (
      <div className={styled.permissionAndrejectBtn}>
        <Button
          label={'승인'}
          btnStyle={'green_btn'}
          onClick={() => openModal('approve')}
        />
        <Button
          label={'반려'}
          btnStyle={'red_btn'}
          onClick={() => openModal('return')}
        />
      </div>
    ) : hasApproval ? (
      <Button
        label={'결재취소'}
        btnStyle={'dark_btn'}
        onClick={() => openModal('cancel')}
      />
    ) : null;
  };

  const updateHandler = () => {
    navigate(`/ADD?page=${approvalDocId}&popup=true`);
  };

  const deleteHandler = () => {
    deleteApprovalDoc(approvalDocId)
      .then((res) => {
        if (res.status === 200) {
          alert('문서가 삭제되었습니다.');
          localStorage.setItem('approvalState', '');
          localStorage.setItem('approvalState', 'delete');
        } else {
          errorHandle(res);
        }
      })
      .catch((e) => {
        alert('삭제를 실패했습니다.');
      });
  };

  const BlueAndGrayBtn = [
    {
      label: '반영',
      onClick: () => {
        approveHandler(mode);
        closeModal();
      },
      btnStyle: 'red_btn',
    },
    {
      label: '취소',
      onClick: () => {
        closeModal();
      },
      btnStyle: 'dark_btn',
    },
  ];

  return (
    <>
      <div className={styled.detailContainer}>
        <InnerBox
          text={formName}
          marginLeft={'10px'}
          width={'100%'}
          height={'100%'}
          titleChildren={returnTitleComponent()}
          children={
            <>
              <DetailForm
                approval_doc_id={approvalDocId}
                setIsTemporal={setIsTemporal}
                setFormName={setFormName}
                reload={reload}
              />
              <div className={styled.updateAndDeleteBtn}>
                {hasUpdate ? (
                  <Button
                    label={'문서수정'}
                    btnStyle={'white_btn'}
                    onClick={updateHandler}
                  />
                ) : null}
                {hasDelete ? (
                  <Button
                    label={'문서삭제'}
                    btnStyle={'dark_btn'}
                    onClick={deleteHandler}
                  />
                ) : null}
              </div>
              {isTemporal ? null : (
                <>
                  <hr style={{ marginLeft: '15px', marginRight: '15px' }}></hr>
                  <ReplyForm approval_doc_id={approvalDocId} />
                </>
              )}
            </>
          }
        ></InnerBox>
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <PopUp
          btnStyle={'popup_non_btn'}
          width="600px"
          height="600px"
          title={mode}
          isModalOpen={isModalOpen}
          openModal={openModal}
          closeModal={closeModal}
          children={
            <>
              <div className={styled.popup}>
                <div>
                  {mode === '승인' ? (
                    <InventoryOutlinedIcon
                      sx={{ fontSize: 250, color: green['A700'] }}
                    />
                  ) : mode === '취소' ? (
                    <AssignmentReturnOutlinedIcon
                      sx={{ fontSize: 250, color: grey[800] }}
                    />
                  ) : (
                    <ContentPasteOffOutlinedIcon
                      sx={{ fontSize: 250, color: red[700] }}
                    />
                  )}
                </div>
                <div className={styled.font}>{mode}하시겠습니까?</div>

                <div className={styled.password}>
                  <label>비밀번호입력</label>
                  <input
                    type="password"
                    className={styled.input}
                    onChange={passwordChange}
                  ></input>
                </div>
              </div>
              <PopUpFoot buttons={BlueAndGrayBtn} />
            </>
          }
        ></PopUp>
      )}
    </>
  );
}
