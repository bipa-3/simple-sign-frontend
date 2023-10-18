import React, { useRef, useState, useEffect } from 'react';
import styled from '../styles/pages/ApprovalRegistPage.module.css';
import ApprovalForm from '../components/approvalManage/approvalRegist/ApprovalForm';
import PopUp from '../components/common/PopUp';
import PopUpFoot from '../components/common/PopUpFoot';
import moment from 'moment';
import { useLoading } from '../contexts/LoadingContext';
import insertApprovalDoc from '../apis/approvalManageAPI/insertApprovalDoc';

export default function SmallBox(props) {
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
  const [drafting_time, setDraftingTime] = useState(moment());
  const [enforce_date, setEnforceDate] = useState(moment());
  const divRef = useRef(null);
  const titleRef = useRef(null); //제목
  const [rec_ref, setRecRef] = useState([]); //수신참조
  const [org_use_list, setOrgUseId] = useState([]); //결재라인

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const dataHandler = (data) => {
    setFormData(data);
  };

  const editorHandler = (ref) => {
    setEditor(ref.currentContent);
  };

  const handleSelectBoxChange = (newValue) => {
    setSequenceCode(newValue);
  };
  const handleDraftingTime = (newValue) => {
    setDraftingTime(newValue);
  };
  const handleEnforcementTime = (newValue) => {
    setEnforceDate(newValue);
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

  const handleClick = (state) => {
    showLoading();
    // console.log('결재라인: ' + org_use_list);
    //console.log('수신참조: ' + rec_ref);
    const orgUserIdList = [];
    if (org_use_list.length != 0) {
      org_use_list.map((data, index) => {
        orgUserIdList.push(data.userId);
      });
    }

    const recRefList = [];
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

    let docStatus = 'T';
    if (state === 'regist') {
      docStatus = 'W';
    }
    // let searchContents = extractTableData(editor);
    const data = {
      formCode: props.form_code,
      approvalDocTitle: titleRef.current.innerHTML,
      docStatus: docStatus,
      seqCode: sequence_code,
      approverList: orgUserIdList,
      receiveRefList: recRefList,
      approvalDate: drafting_time.format('YYYY-MM-DDTHH:mm:ss'),
      enforcementDate: enforce_date.format('YYYY-MM-DDTHH:mm:ss'),
      contents: editor,
    };

    //결재상신
    insertApprovalDoc(data)
      .then((res) => {
        if (res.status == '200') {
          if (docStatus === 'T') {
            alert('임시저장되었습니다.');
          } else if (docStatus === 'W') {
            alert('상신되었습니다.');
          }
          setRecRef('');
          closeModal();
        }
      })
      .catch((e) => {
        hideLoading();
        console.error(e);
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

  return (
    <>
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
        title="결재작성상세"
        children={
          <>
            <ApprovalForm
              form_code={props.form_code}
              main_form={main_form}
              setMainForm={setMainForm}
              divRef={divRef}
              titleRef={titleRef}
              rec_ref={rec_ref}
              setRecRef={setRecRef}
              org_use_list={org_use_list}
              setOrgUseId={setOrgUseId}
              dataHandler={dataHandler}
              editorHandler={editorHandler}
              handleSelectBoxChange={handleSelectBoxChange}
              handleDraftingTime={handleDraftingTime}
              handleEnforcementTime={handleEnforcementTime}
            />
            <PopUpFoot buttons={BlueAndGrayBtn} />
          </>
        }
        isModalOpen={isModalOpen}
        openModal={openModal}
        closeModal={closeModal}
      ></PopUp>
    </>
  );
}
