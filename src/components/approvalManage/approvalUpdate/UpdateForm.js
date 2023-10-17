import React, { useState, useEffect } from 'react';
import ReactHtmlParser from 'html-react-parser';
import moment from 'moment';
import SelectDate from '../approvalRegist/components/SelectDate';
import SelectBox from '../../common/Selectbox';
import { TinyEditor } from '../../common/TinyEditor';
import styled from '../../../styles/components/approvalManage/approvalUpdate/UpdateForm.module.css';
import PopUp from '../../common/PopUp';
import PopUpFoot from '../../common/PopUpFoot';
import OrgChart from '../../org/OrgChart';
import getApprovalDoc from '../../../apis/approvalManageAPI/getApprovalDoc';
import getSequenceList from '../../../apis/approvalManageAPI/getSequenceList';
import deleteContentEditableError from '../../../apis/approvalManageAPI/deleteContentEditableError';
import { useLoading } from '../../../contexts/LoadingContext';
import {
  DetailBox,
  AreaBox,
} from '../../formManage/formDetail/components/DetailTableItem';
import { useFormManage } from '../../../contexts/FormManageContext';

export default function UpdateForm({
  approval_doc_id,
  handleDraftingTime,
  handleEnforcementTime,
  handleSelectBoxChange,
  dataHandler,
  editorHandler,
  titleRef,
  org_use_list,
  setOrgUseId,
  rec_ref,
  setRecRef,
}) {
  const [default_form, setDefaultForm] = useState('');
  const [userName, setUserName] = useState('');
  const [deptName, setDeptName] = useState('');
  const [productNum, setProductNum] = useState('');
  const [approvalDate, setApprovalDate] = useState('');
  const [enforcementDate, setEnforcementDate] = useState('');
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [form_code, setFormCode] = useState(0);
  const [sequence, setSequence] = useState([]);
  const [condition, setCondition] = useState('rec_ref');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showLoading, hideLoading } = useLoading();
  const { detailData, setDetailData, resetDetailData } = useFormManage();

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
  const scopeConfirm = (data, type) => {
    if (type === 'approval') {
      console.log('결재라인들어감');
      dataUpdateHandler('scope', data);
    } else {
      console.log('수신참조들어감');
      dataUpdateHandler('scope2', data);
    }
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
    //결재문서 상세조회
    getApprovalDoc(approval_doc_id)
      .then((json) => {
        console.log(json);
        setDefaultForm(json.defaultForm);
        setUserName(json.userName);
        setDeptName(json.deptName);
        setProductNum(json.productNum);
        setTitle(json.approvalDocTitle);
        setApprovalDate(moment(json.approvalDate));
        setEnforcementDate(moment(json.enforcementDate));
        setContents(json.contents);
        setFormCode(json.formCode);
        setOrgUseId(json.approvalLineList);
        setRecRef(json.receivedRefList);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        hideLoading();
      });

    if (form_code !== 0) {
      getSequenceList(form_code).then((json) => {
        setSequence(json);
      });
    }

    deleteContentEditableError();
  }, [form_code]);

  useEffect(() => {
    // console.log(rec_ref);
    // console.log(org_use_list);

    if (rec_ref.length !== 0) {
      scopeConfirm(rec_ref);
    }
  }, [rec_ref, org_use_list]);

  return (
    <>
      <div>
        {ReactHtmlParser(default_form, {
          replace: (domNode) => {
            if (domNode.attribs && domNode.attribs.id == 'approval_line') {
              return (
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
                        {org_use_list.length > 0 ? org_use_list[0].user : ''}
                      </td>
                      <td>
                        {org_use_list.length > 1 ? org_use_list[1].user : ''}
                      </td>
                      <td>
                        {org_use_list.length > 2 ? org_use_list[2].user : ''}
                      </td>
                      <td>
                        {org_use_list.length > 3 ? org_use_list[3].user : ''}
                      </td>
                      <td>
                        {org_use_list.length > 4 ? org_use_list[4].user : ''}
                      </td>
                      <td>
                        {org_use_list.length > 5 ? org_use_list[5].user : ''}
                      </td>
                      <td>
                        {org_use_list.length > 6 ? org_use_list[6].user : ''}
                      </td>
                      <td>
                        {org_use_list.length > 7 ? org_use_list[7].user : ''}
                      </td>
                    </tr>
                  </table>
                </div>
              );
            }
            if (domNode.attribs && domNode.attribs.id === 'doc_num') {
              return (
                <div id="doc_num" contentEditable="false">
                  {productNum === null ? (
                    <SelectBox
                      selectList={sequence}
                      width={'300'}
                      height={'30'}
                      onChange={handleSelectBoxChange}
                    />
                  ) : (
                    productNum
                  )}
                </div>
              );
            }
            if (domNode.attribs && domNode.attribs.id === 'drafting_time') {
              return (
                <div id="drafting_time" className={styled.selectContainer}>
                  <SelectDate
                    handleSelectTimeChange={handleDraftingTime}
                    baseDate={approvalDate}
                  />
                </div>
              );
            }
            if (domNode.attribs && domNode.attribs.id === 'drafter') {
              return (
                <div id="drafter" contentEditable="false">
                  {userName}
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
                  {title}
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
                    baseDate={enforcementDate}
                  />
                </div>
              );
            }
            if (domNode.attribs && domNode.attribs.id == 'enforcer') {
              return <div id="enforcer" contentEditable="false"></div>;
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
                            data={detailData.scope2}
                            dataHandler={scopefilterHandler}
                          />
                          <OrgChart
                            view={'user'}
                            initData={detailData.scope2.map((ele, index) => {
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
            if (domNode.attribs && domNode.attribs.id == 'content') {
              return (
                <>
                  <h4>신청내용</h4>
                  <div id="content" className={styled.container}>
                    <TinyEditor
                      init={contents}
                      editorHandler={editorHandler}
                      dataHandler={dataHandler}
                    />
                  </div>
                </>
              );
            }
          },
        })}
      </div>

      {/*모달*/}
      {condition === 'approval' ? (
        <OrgChart
          initData={detailData.scope.map((ele, index) => {
            ele.id = index;
            return ele;
          })}
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
