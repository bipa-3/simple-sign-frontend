import React, { useRef, useState, useEffect, useMemo } from 'react';
import styled from '../styles/pages/ApprovalRegistPage.module.css';
import ApprovalForm from '../components/approvalManage/approvalRegist/ApprovalForm';
import PopUp from '../components/common/PopUp';
import PopUpFoot from '../components/common/PopUpFoot';
import moment from 'moment';
import { useLoading } from '../contexts/LoadingContext';
import insertApprovalDoc from '../apis/approvalManageAPI/insertApprovalDoc';
import errorHandle from '../apis/errorHandle';
import { checkFormCreateData } from '../validation/approvalManage/approvalFormSchema';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarRateIcon from '@mui/icons-material/StarRate';
import { yellow } from '@mui/material/colors';
import insertFavorites from '../apis/approvalManageAPI/insertFavorites';
import deleteFavorites from '../apis/approvalManageAPI/deleteFavorites';
import { useFormManage } from '../contexts/FormManageContext';
import getDefaultApprovalLine from '../apis/approvalManageAPI/getDefaultApprovalLine';
import LinearProgressWithLabel from '../components/common/LinearProgressWithLabel';

export default function ApprovalRegist(props) {
  //추천 양식 클릭시 사용할 양식 정보와 상태값
  const { id } = useParams();
  let status = props.form_code === parseInt(id) ? true : false;

  const innerBoxStyle = {
    width: props.width,
    height: props.height,
  };

  //에디터
  const [formData, setFormData] = useState(null);
  const [editor, setEditor] = useState(null);
  //모달
  const [isModalOpen, setIsModalOpen] = useState(false);
  //로딩
  const { showLoading, hideLoading } = useLoading();

  //register 데이터
  const [main_form, setMainForm] = useState('');
  const [sequence_code, setSequenceCode] = useState('');
  const initialDraftingTime = useMemo(() => dayjs(moment()), []);
  const initialEnforceDate = useMemo(() => dayjs(moment()), []);
  const [drafting_time, setDraftingTime] = useState(initialDraftingTime);
  const [enforce_date, setEnforceDate] = useState(initialEnforceDate);
  const titleRef = useRef(null); //제목
  const [rec_ref, setRecRef] = useState([]); //수신참조
  const [org_use_list, setOrgUseId] = useState([]); //결재라인
  const [files, setFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [clickStar, setClickStar] = useState(props.favorites);
  const [isFocused, setIsFocused] = useState(false);
  const [formName, setFormName] = useState('');
  const { detailData, setDetailData, resetDetailData } = useFormManage();
  const [condition, setCondition] = useState('rec_ref');

  const dataUpdateHandler = (id, data) => {
    setDetailData((prevData) => ({
      ...prevData,
      [id]: data,
    }));
  };

  const scopeConfirm = (data, type) => {
    if (condition === 'approval' || type === 'approval') {
      dataUpdateHandler('approvalLine', data);
    } else {
      dataUpdateHandler('scope', data);
    }
  };

  const openModal = () => {
    getDefaultApprovalLine(props.form_code).then((res) => {
      const updatedData = res.map((item) => {
        const {
          approvalDate,
          approvalOrder,
          approvalStatus,
          signFileId,
          signState,
          ...rest
        } = item;
        return { ...rest };
      });
      scopeConfirm(updatedData, 'approval');
    });
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setFiles([]);
    setFileNames([]);
    setIsModalOpen(false);
    setSequenceCode('');
    setRecRef([]);
    titleRef.current.textContent = '';
    setIsFocused(false);
    resetDetailData();
    setDraftingTime(dayjs(moment()));
    setEnforceDate(dayjs(moment()));
  };

  const dataHandler = (data) => {
    console.log(data);
    setFormData(data);
  };

  const editorHandler = (ref) => {
    setEditor(ref.currentContent);
  };

  const handleSelectBoxChange = (newValue) => {
    setSequenceCode(newValue);
  };

  // const extractTableData = () => {
  //   const table = document.querySelector('table');
  //   const rows = table.querySelectorAll('tr');
  //   const data = {};

  //   rows.forEach((row) => {
  //     const cells = row.querySelectorAll('td');
  //     if (cells.length === 2) {
  //       const key = cells[0].textContent.trim();
  //       const value = cells[1].textContent.trim();
  //       data[key] = value;
  //     }
  //   });
  //   return data;
  // };

  const handleClickStar = () => {
    setClickStar(!clickStar);

    if (clickStar) {
      deleteFavorites(props.form_code);
    } else if (clickStar === false) {
      insertFavorites(props.form_code);
    }
  };

  const handleClick = (state) => {
    showLoading();
    if (titleRef.current.textContent === '제목을 입력하세요') {
      titleRef.current.textContent = '';
      titleRef.current.focus();
    }
    const orgUserIdList = [];
    if (org_use_list.length != 0) {
      org_use_list.map((data, index) => {
        orgUserIdList.push(data.userId);
      });
    }

    const recRefList = [];
    if (rec_ref.length != 0) {
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
        } else if (data.category === 'U') {
          recRefList.push({
            id: data.userId,
            category: 'U',
            name: data.user,
          });
        }
      });
    }

    let docStatus = 'T';
    if (state === 'regist') {
      docStatus = 'W';
    }

    // let searchContents = extractTableData(editor);
    const approvalDocReqDTO = {
      formCode: props.form_code,
      formName: props.form_name,
      approvalDocTitle: titleRef.current.innerHTML,
      docStatus: docStatus,
      seqCode: sequence_code,
      approverList: orgUserIdList,
      receiveRefList: recRefList,
      approvalDate: drafting_time.format('YYYY-MM-DDTHH:mm:ss'),
      enforcementDate: enforce_date.format('YYYY-MM-DDTHH:mm:ss'),
      contents: editor,
    };

    const data = new FormData();

    data.append(
      'approvalDocReqDTO',
      new Blob([JSON.stringify(approvalDocReqDTO)], {
        type: 'application/json',
      })
    );
    files.forEach((file, index) => {
      data.append('files', file.object);
    });

    checkFormCreateData(approvalDocReqDTO)
      .then(() => {
        registApprovalDoc(data, docStatus);
      })
      .catch((errors) => {
        alert(errors.message);
        hideLoading();
      });
  };

  const registApprovalDoc = (data, docStatus) => {
    //결재상신
    insertApprovalDoc(data)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          if (docStatus === 'T') {
            alert('임시저장되었습니다.');
          } else if (docStatus === 'W') {
            alert('상신되었습니다.');
          }
          setRecRef('');
          closeModal();
        } else {
          console.log('errorhandle');
          errorHandle(res);
        }
      })
      .catch((e) => {
        hideLoading();
        if (e.message === 'Failed to fetch') {
          alert('파일 사이즈가 너무 큽니다.');
        }
      })
      .finally(() => {
        hideLoading();
      });
  };

  const BlueAndGrayBtn = [
    {
      label: '상신',
      onClick: () => {
        handleClick('regist');
      },
      btnStyle: 'red_btn',
    },
    {
      label: '임시저장',
      onClick: () => {
        handleClick('temporal');
      },
      btnStyle: 'blue_btn',
    },
    {
      label: '취소',
      onClick: () => {
        closeModal();
      },
      btnStyle: 'dark_btn',
    },
  ];

  //추천 양식 클릭시 모달창 여는 부분
  useEffect(() => {
    setIsModalOpen(status);
  }, []);

  return (
    <div className={styled.container}>
      <PopUp
        label={
          <div>
            <div className={styled.box} style={innerBoxStyle}>
              <div className={styled.title}>{props.form_name}</div>
              <div className={styled.content}>{props.form_explain}</div>
            </div>
          </div>
        }
        btnStyle={'popup_non_btn'}
        width="1300px"
        height="800px"
        title={formName}
        children={
          <>
            <ApprovalForm
              form_code={props.form_code}
              main_form={main_form}
              setMainForm={setMainForm}
              titleRef={titleRef}
              setRecRef={setRecRef}
              org_use_list={org_use_list}
              setOrgUseId={setOrgUseId}
              dataHandler={dataHandler}
              editorHandler={editorHandler}
              handleSelectBoxChange={handleSelectBoxChange}
              drafting_time={drafting_time}
              setDraftingTime={setDraftingTime}
              enforce_date={enforce_date}
              setEnforceDate={setEnforceDate}
              files={files}
              fileNames={fileNames}
              setFiles={setFiles}
              setFileNames={setFileNames}
              isFocused={isFocused}
              setIsFocused={setIsFocused}
              setFormName={setFormName}
              scopeConfirm={scopeConfirm}
              condition={condition}
              setCondition={setCondition}
              detailData={detailData}
              setDetailData={setDetailData}
              resetDetailData={resetDetailData}
            />
            <PopUpFoot buttons={BlueAndGrayBtn} />
          </>
        }
        isModalOpen={isModalOpen}
        openModal={openModal}
        closeModal={closeModal}
      ></PopUp>
      <div className={styled.star} onClick={handleClickStar}>
        {clickStar ? (
          <StarRateIcon sx={{ color: yellow[500] }} fontSize="large" />
        ) : (
          <StarBorderIcon sx={{ color: yellow[500] }} fontSize="large" />
        )}
      </div>
    </div>
  );
}
