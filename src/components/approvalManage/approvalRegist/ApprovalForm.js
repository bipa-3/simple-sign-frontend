import React, { useEffect, useState } from 'react';
import ReactHtmlParser from 'html-react-parser';
import Selectbox from '../../common/Selectbox';
import SelectDate from './components/SelectDate';
import { TinyEditor } from '../../common/TinyEditor';
import styled from '../../../styles/components/approvalManage/approvalRegist/ApprovalForm.module.css';
import OrgChart from '../../org/OrgChart';
import { useLoading } from '../../../contexts/LoadingContext';
import getForm from '../../../apis/approvalManageAPI/getForm';
import getSequenceList from '../../../apis/approvalManageAPI/getSequenceList';
import deleteContentEditableError from '../../../apis/approvalManageAPI/deleteContentEditableError';
import {
  DetailBox,
  AreaBox,
} from '../../formManage/formDetail/components/DetailTableItem';
import FileBox from './FileBox';

export default function ApprovalForm({
  form_code,
  main_form,
  setMainForm,
  titleRef,
  setRecRef,
  org_use_list,
  setOrgUseId,
  dataHandler,
  editorHandler,
  handleSelectBoxChange,
  drafting_time,
  setDraftingTime,
  enforce_date,
  setEnforceDate,
  files,
  fileNames,
  setFiles,
  setFileNames,
  isFocused,
  setIsFocused,
  setFormName,
  scopeConfirm,
  condition,
  setCondition,
  detailData,
  setDetailData,
}) {
  const [sequence, setSequence] = useState([]);
  const [default_form, setDefaultForm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { showLoading, hideLoading } = useLoading();
  const deptName = localStorage.getItem('deptName');

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCondition('');
    setIsModalOpen(false);
  };
  const handleApprovalClick = () => {
    setCondition('approval');
    openModal();
  };

  const scopefilterHandler = (id, category, useId) => {
    let filetedData = detailData.scope.filter((ele) => {
      if (ele.category === category && ele.useId === useId) {
        return false;
      }
      return true;
    });
    setDetailData({ ...detailData, [id]: filetedData });
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (titleRef.current.textContent === '제목을 입력하세요') {
      titleRef.current.textContent = '';
    }
  };

  useEffect(() => {
    setOrgUseId(detailData.approvalLine);

    detailData.scope.forEach((data) => {
      if (
        data.category === 'C' ||
        data.category === 'D' ||
        data.category === 'E'
      ) {
        data.userId = null;
        data.user = null;
      }
    });

    setRecRef(detailData.scope);
  }, [detailData]);

  useEffect(() => {
    showLoading();
    setOrgUseId('');
    //resetDetailData;

    //양식 상세조회
    getForm(form_code)
      .then((json) => {
        setDefaultForm(json.defaultForm);
        setMainForm(json.mainForm);
        setFormName(json.formName);
      })
      .finally(() => {
        hideLoading();
      });

    //채번리스트 조회
    getSequenceList(form_code).then((json) => {
      setSequence(json);
    });

    deleteContentEditableError();
  }, []);

  const renderApproval = (approval) => {};

  return (
    <>
      <div className={styled.container}>
        <div className={styled.subContainer}>
          {ReactHtmlParser(default_form, {
            replace: (domNode) => {
              if (domNode.attribs && domNode.attribs.id == 'approval_line') {
                return (
                  <>
                    <table
                      border={'1px solid'}
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        height: '100%',
                      }}
                      onClick={handleApprovalClick}
                    >
                      <tr style={{ height: '20px' }}>
                        <td>결재자1</td>
                        <td>결재자2</td>
                        <td>결재자3</td>
                        <td>결재자4</td>
                        <td>결재자5</td>
                        <td>결재자6</td>
                        <td>결재자7</td>
                        <td>결재자8</td>
                      </tr>
                      <tr style={{ height: '70px' }}>
                        {[...Array(8)].map((_, index) => (
                          <td
                            style={{
                              textAlign: 'center',
                              width: '12.5%',
                              height: '70px',
                            }}
                            key={index}
                          >
                            {org_use_list.length > index
                              ? org_use_list[index].user
                              : ''}
                          </td>
                        ))}
                      </tr>
                    </table>
                  </>
                );
              }
              if (domNode.attribs && domNode.attribs.id === 'doc_num') {
                return (
                  <Selectbox
                    selectList={sequence}
                    width={'300'}
                    height={'30'}
                    onChange={handleSelectBoxChange}
                  />
                );
              }
              if (domNode.attribs && domNode.attribs.id === 'drafting_time') {
                return (
                  <div className={styled.selectContainer}>
                    <SelectDate
                      value={drafting_time}
                      setValue={setDraftingTime}
                      baseDate={null}
                    />
                  </div>
                );
              }
              if (domNode.attribs && domNode.attribs.id === 'drafter') {
                return (
                  <div id="drafter" contentEditable="false">
                    {localStorage.getItem('userName')}
                  </div>
                );
              }
              if (domNode.attribs && domNode.attribs.id === 'drafter_dept') {
                return (
                  <div id="drafter_dept" contentEditable="false">
                    {deptName}
                  </div>
                );
              }
              if (domNode.attribs && domNode.attribs.id == 'form_title') {
                return (
                  <div
                    id="form_title"
                    contentEditable="true"
                    ref={titleRef}
                    className={isFocused ? '' : styled.placeholder}
                    onFocus={handleFocus}
                  >
                    {isFocused ? '' : '제목을 입력하세요'}
                  </div>
                );
              }
              if (domNode.attribs && domNode.attribs.id == 'enforce_date') {
                return (
                  <div
                    id="enforce_date"
                    contentEditable="true"
                    className={styled.selectContainer}
                  >
                    <SelectDate
                      value={enforce_date}
                      setValue={setEnforceDate}
                      baseDate={null}
                    />
                  </div>
                );
              }
              if (domNode.attribs && domNode.attribs.id == 'rec_ref') {
                return (
                  <>
                    <div id="receiveList">
                      <DetailBox
                        children={
                          <>
                            <AreaBox
                              id={'scope'}
                              data={detailData.scope}
                              dataHandler={scopefilterHandler}
                            />
                            <OrgChart
                              view={'user'}
                              initData={detailData.scope.map((ele, index) => {
                                ele.id = index;
                                return ele;
                              })}
                              isModalOpen={isModalOpen}
                              openModal={openModal}
                              closeModal={closeModal}
                              confirmHandler={scopeConfirm}
                              comp={
                                detailData.compId > 1 ? detailData.compId : 0
                              }
                            />
                          </>
                        }
                      ></DetailBox>
                    </div>
                  </>
                );
              }
              if (domNode.attribs && domNode.attribs.id == 'content') {
                return (
                  <div id="content" className={styled.editor}>
                    <TinyEditor
                      init={main_form}
                      editorHandler={editorHandler}
                      dataHandler={dataHandler}
                      resetEditor={true}
                    />
                  </div>
                );
              }
            },
          })}
        </div>
        <FileBox
          id={'file'}
          files={files}
          fileNames={fileNames}
          setFiles={setFiles}
          setFileNames={setFileNames}
        />
      </div>

      {/*모달*/}
      {condition === 'approval' ? (
        <OrgChart
          initData={detailData.approvalLine.map((ele, index) => {
            ele.id = index;
            return ele;
          })}
          view={'approvalUser'}
          isModalOpen={isModalOpen}
          openModal={openModal}
          closeModal={closeModal}
          confirmHandler={scopeConfirm}
          comp={detailData.compId > 1 ? detailData.compId : 0}
        />
      ) : null}
    </>
  );
}
