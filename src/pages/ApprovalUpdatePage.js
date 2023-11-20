import React, { useEffect, useState, useRef } from 'react';
import InnerBox from '../components/common/InnerBox';
import UpdateForm from '../components/approvalManage/approvalUpdate/UpdateForm';
import Button from '../components/common/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import updateApprovalDoc from '../apis/approvalManageAPI/updateApprovalDoc';
import { useLoading } from '../contexts/LoadingContext';
import moment from 'moment';
import { usePage } from '../contexts/PageContext';
import styled from '../styles/pages/ApprovalUpdatePage.module.css';
import updateTemporalApprovalDoc from '../apis/approvalManageAPI/updateTemporalApprovalDoc';
import errorHandle from '../apis/errorHandle';
import { checkFormCreateData } from '../validation/approvalManage/approvalFormSchema';

export default function ApprovalUpdatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  //에디터
  const [formData, setFormData] = useState(null);
  const [editor, setEditor] = useState(null);
  //로딩
  const { showLoading, hideLoading } = useLoading();
  const { state, setState } = usePage();

  //update 데이터
  const [sequence_code, setSequenceCode] = useState('');
  const [drafting_time, setDraftingTime] = useState(moment());
  const [enforce_date, setEnforceDate] = useState(moment());
  const titleRef = useRef(null); //제목
  const [rec_ref, setRecRef] = useState([]); //수신참조
  const [org_use_list, setOrgUseId] = useState([]); //결재라인
  const [docStatus, setDocStatus] = useState(''); //임시저장여부
  const [files, setFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [version, setVersion] = useState([]);

  const queryParams = new URLSearchParams(location.search);
  const approvalDocId = queryParams.get('page');

  const handleSelectBoxChange = (newValue) => {
    setSequenceCode(newValue);
  };
  const handleDraftingTime = (newValue) => {
    setDraftingTime(newValue);
  };
  const handleEnforcementTime = (newValue) => {
    setEnforceDate(newValue);
  };
  const dataHandler = (data) => {
    setFormData(data);
  };
  const editorHandler = (ref) => {
    setEditor(ref.currentContent);
  };

  const handleCancel = () => {
    navigate(`/AD?page=${approvalDocId}&popup=true`);
  };

  const handleUpdate = (type) => {
    //console.log(type);
    //페이지 데이터 셋팅
    setState({ ...state, curPage: '결재문서수정' });
    showLoading();

    const orgUserIdList = [];
    if (org_use_list !== null) {
      org_use_list.map((data, index) => {
        orgUserIdList.push(data.userId);
      });
    }

    const recRefList = [];
    if (rec_ref !== null) {
      rec_ref.map((data) => {
        if (data.category === 'C') {
          recRefList.push({
            id: data.compId,
            category: 'C',
            name: data.company,
          });
        } else if (data.category === 'E') {
          recRefList.push({
            id: data.estId,
            category: 'E',
            name: data.establishment,
          });
        } else if (data.category === 'D') {
          recRefList.push({
            id: data.deptId,
            category: 'D',
            name: data.department,
          });
        } else {
          recRefList.push({
            id: data.userId,
            category: 'U',
            name: data.user,
          });
        }
      });
    }

    let updateDocStatus = { ...docStatus };
    if (docStatus === 'T' && type === 'update') {
      updateDocStatus = 'W';
    } else {
      updateDocStatus = docStatus[0];
    }

    const approvalDocReqDTO = {
      approvalDocTitle: titleRef.current.innerHTML,
      seqCode: sequence_code,
      receiveRefList: recRefList,
      docStatus: updateDocStatus,
      createdAt: drafting_time.format('YYYY-MM-DDTHH:mm:ss'),
      enforcementDate: enforce_date.format('YYYY-MM-DDTHH:mm:ss'),
      contents: editor,
      approverList: orgUserIdList,
      receiveRefList: recRefList,
      version: version,
    };

    const data = new FormData();

    data.append(
      'approvalDocReqDTO',
      new Blob([JSON.stringify(approvalDocReqDTO)], {
        type: 'application/json',
      })
    );
    console.log(files);
    files.forEach((file, index) => {
      data.append('files', file.object);
    });

    checkFormCreateData(approvalDocReqDTO)
      .then(() => {
        updateApprovalDocByType(data, type);
      })
      .catch((errors) => {
        alert(errors.message);
        hideLoading();
      });
  };

  const updateApprovalDocByType = (data, type) => {
    if (type === 'temporal') {
      updateTemporalApprovalDoc(approvalDocId, data)
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            alert('문서가 수정되었습니다');
            navigate(`/AD?page=${approvalDocId}&popup=true`);
          } else {
            errorHandle(res);
          }
        })
        .catch((e) => console.error(e))
        .finally(() => {
          hideLoading();
        });
    } else if (type === 'update') {
      updateApprovalDoc(approvalDocId, data)
        .then((res) => {
          if (res.status === 200 && docStatus === 'T') {
            alert('문서가 상신되었습니다.');
            navigate(`/AD?page=${approvalDocId}&popup=true`);
          } else if (res.status === 200) {
            alert('문서가 수정되었습니다.');
            navigate(`/AD?page=${approvalDocId}&popup=true`);
          } else {
            errorHandle(res);
            hideLoading();
          }
        })
        .catch((e) => {
          console.error(e);
        })
        .then(() => {
          hideLoading();
        });
    }
  };

  return (
    <div>
      <div className={styled.container}>
        <InnerBox
          text={'결재문서수정페이지'}
          width={'100%'}
          height={'100%'}
          children={
            <>
              <UpdateForm
                approval_doc_id={approvalDocId}
                handleDraftingTime={handleDraftingTime}
                handleEnforcementTime={handleEnforcementTime}
                handleSelectBoxChange={handleSelectBoxChange}
                dataHandler={dataHandler}
                editorHandler={editorHandler}
                titleRef={titleRef}
                org_use_list={org_use_list}
                setOrgUseId={setOrgUseId}
                rec_ref={rec_ref}
                setRecRef={setRecRef}
                setDocStatus={setDocStatus}
                files={files}
                fileNames={fileNames}
                setFiles={setFiles}
                setFileNames={setFileNames}
                setVersion={setVersion}
              />
              <div className={styled.updateAndDeleteBtn}>
                {docStatus === 'T' ? (
                  <>
                    <Button
                      label={'상신'}
                      btnStyle={'red_btn'}
                      onClick={() => handleUpdate('update')}
                    />
                    <Button
                      label={'수정'}
                      btnStyle={'green_btn'}
                      onClick={() => handleUpdate('temporal')}
                    />
                  </>
                ) : (
                  <Button
                    label={'수정'}
                    btnStyle={'green_btn'}
                    onClick={() => handleUpdate('update')}
                  />
                )}

                <Button
                  label={'취소'}
                  btnStyle={'dark_btn'}
                  onClick={handleCancel}
                />
              </div>
            </>
          }
        ></InnerBox>
      </div>
    </div>
  );
}
