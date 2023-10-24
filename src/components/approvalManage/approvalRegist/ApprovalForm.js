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
import { useFormManage } from '../../../contexts/FormManageContext';
import FileBox from './FileBox';

export default function ApprovalForm({
  form_code,
  main_form,
  setMainForm,
  divRef,
  titleRef,
  rec_ref,
  setRecRef,
  org_use_list,
  setOrgUseId,
  dataHandler,
  editorHandler,
  handleSelectBoxChange,
  handleEnforcementTime,
  handleDraftingTime,
  files,
  fileNames,
  setFiles,
  setFileNames,
  fileUpdateHandler,
}) {
  const [sequence, setSequence] = useState([]);
  const [default_form, setDefaultForm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [condition, setCondition] = useState('rec_ref');
  const { showLoading, hideLoading } = useLoading();
  const { detailData, setDetailData, resetDetailData } = useFormManage();
  const userOrgList = JSON.parse(localStorage.getItem('userOrgList'));
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

  const dataUpdateHandler = (id, data) => {
    setDetailData({ ...detailData, [id]: data });
  };
  const scopeConfirm = (data) => {
    dataUpdateHandler('scope', data);
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

  useEffect(() => {
    showLoading();

    //양식 상세조회
    getForm(form_code)
      .then((json) => {
        setDefaultForm(json.defaultForm);
        setMainForm(json.mainForm);
      })
      .finally(() => {
        hideLoading();
      });

    //채번리스트 조회
    getSequenceList(form_code).then((json) => {
      setSequence(json);
    });

    deleteContentEditableError();

    //수신참조 내역 넣기
    setRecRef(detailData.scope);
  }, [form_code, detailData]);

  useEffect(() => {
    setOrgUseId('');
    resetDetailData();
  }, []);

  return (
    <>
      <div className={styled.container}>
        <div className={styled.subContainer}>
          {ReactHtmlParser(default_form, {
            replace: (domNode) => {
              if (domNode.attribs && domNode.attribs.id == 'approval_line') {
                return (
                  <>
                    <div id="approval_line">
                      <table
                        border={'1px solid'}
                        style={{ width: '100%', borderCollapse: 'collapse' }}
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
                          <td>
                            {org_use_list.length > 0
                              ? org_use_list[0].user
                              : ''}
                          </td>
                          <td>
                            {org_use_list.length > 1
                              ? org_use_list[1].user
                              : ''}
                          </td>
                          <td>
                            {org_use_list.length > 2
                              ? org_use_list[2].user
                              : ''}
                          </td>
                          <td>
                            {org_use_list.length > 3
                              ? org_use_list[3].user
                              : ''}
                          </td>
                          <td>
                            {org_use_list.length > 4
                              ? org_use_list[4].user
                              : ''}
                          </td>
                          <td>
                            {org_use_list.length > 5
                              ? org_use_list[5].user
                              : ''}
                          </td>
                          <td>
                            {org_use_list.length > 6
                              ? org_use_list[6].user
                              : ''}
                          </td>
                          <td>
                            {org_use_list.length > 7
                              ? org_use_list[7].user
                              : ''}
                          </td>
                        </tr>
                      </table>
                    </div>
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
                    <SelectDate handleSelectTimeChange={handleDraftingTime} />
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
                  <div id="form_title" contentEditable="true" ref={titleRef}>
                    제목을 입력하세요
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
                      handleSelectTimeChange={handleEnforcementTime}
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
                            />
                          </>
                        }
                      ></DetailBox>
                    </div>
                  </>
                );
              }
              if (domNode.attribs && domNode.attribs.id == 'enforcer') {
                return (
                  <div id="enforcer" contentEditable="true" ref={divRef}></div>
                );
              }
              if (domNode.attribs && domNode.attribs.id == 'content') {
                return (
                  <div id="content" className={styled.editor}>
                    <TinyEditor
                      init={main_form}
                      editorHandler={editorHandler}
                      dataHandler={dataHandler}
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
          dataHandler={fileUpdateHandler}
        />
      </div>

      {/*모달*/}
      {condition === 'approval' ? (
        <OrgChart
          initData={''}
          view={'user'}
          isModalOpen={isModalOpen}
          openModal={openModal}
          closeModal={closeModal}
          confirmHandler={setOrgUseId}
        />
      ) : null}
    </>
  );
}
