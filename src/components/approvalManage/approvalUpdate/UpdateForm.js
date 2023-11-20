import React, { useState, useEffect } from 'react';
import ReactHtmlParser from 'html-react-parser';
import moment from 'moment';
import SelectDate from '../approvalRegist/components/SelectDate';
import SelectBox from '../../common/Selectbox';
import { TinyEditor } from '../../common/TinyEditor';
import styled from '../../../styles/components/approvalManage/approvalUpdate/UpdateForm.module.css';
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
import errorHandle from '../../../apis/errorHandle';
import { useNavigate } from 'react-router-dom';
import FileBox from '../approvalRegist/FileBox';
import getFileNames from '../../../apis/approvalManageAPI/getFileNames';
import { getCompId } from '../../../utils/getUser';

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
  setDocStatus,
  files,
  fileNames,
  setFiles,
  setFileNames,
  setVersion,
}) {
  const navigate = useNavigate();
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
  const [initSequence, setInitSequence] = useState(0);
  const [selectedValue, setSelectedValue] = useState(0);

  const { showLoading, hideLoading } = useLoading();
  const { detailData, setDetailData } = useFormManage();

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
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            //console.log(data);
            setDefaultForm(data.defaultForm);
            setUserName(data.userName);
            setDeptName(data.deptName);
            setProductNum(data.productNum);
            setTitle(data.approvalDocTitle);
            setApprovalDate(moment(data.approvalDate));
            setEnforcementDate(moment(data.enforcementDate));
            setContents(data.contents);
            setFormCode(data.formCode);
            setOrgUseId(data.approvalLineList);
            setRecRef(data.receivedRefList);
            setDocStatus(data.docStatus);
            setInitSequence(data.seqCode);
            setVersion(data.version);
            setSelectedValue(data.seqCode);
          });
        } else {
          errorHandle(res);
          navigate('/');
        }
      })
      .catch((e) => {
        console.log(e);
        navigate('/');
      })
      .finally(() => {
        hideLoading();
      });

    //파일 조회
    getFileNames(approval_doc_id)
      .then((res) => {
        //console.log(res);
        const filesWithObjects = res.map((ele) => ({ name: ele.fileName }));
        setFileNames(filesWithObjects);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        hideLoading();
      });

    if (form_code !== 0) {
      getSequenceList(form_code).then((json) => {
        setSequence(json);
      });
    }
    if (rec_ref.length !== 0) {
      scopeConfirm(rec_ref);
    }
    if (org_use_list.length !== 0) {
      scopeConfirm(org_use_list, 'approval');
    }

    deleteContentEditableError();
  }, [form_code]);

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
    console.log(fileNames);
  }, [fileNames]);

  return (
    <div className={styled.container}>
      <div className={styled.subContainer}>
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
                      selectedValue={selectedValue}
                      setSelectedValue={setSelectedValue}
                      onChange={handleSelectBoxChange}
                      init={initSequence}
                    />
                  ) : (
                    productNum
                  )}
                </div>
              );
            }
            if (domNode.attribs && domNode.attribs.id === 'drafting_time') {
              return (
                <div className={styled.selectContainer}>
                  <SelectDate
                    value={approvalDate}
                    setValue={handleDraftingTime}
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
                    value={enforcementDate}
                    setValue={handleEnforcementTime}
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
                            comp={getCompId()}
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
                    init={contents}
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
      />

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
          comp={getCompId()}
        />
      ) : null}
    </div>
  );
}
