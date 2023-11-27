import React, { useState, useEffect } from 'react';
import ReactHtmlParser from 'html-react-parser';
import { useNavigate } from 'react-router-dom';
import DefaultSign from '../../userinfo/DefaultSign';
import getApprovalDoc from '../../../apis/approvalManageAPI/getApprovalDoc';
import deleteContentEditableError from '../../../apis/approvalManageAPI/deleteContentEditableError';
import { useLoading } from '../../../contexts/LoadingContext';
import { getSign, getApproverSign } from '../../../apis/userInfoAPl/getSign';
import styled from '../../../styles/components/approvalManage/approvalDetail/DetailForm.module.css';
import errorHandle from '../../../apis/errorHandle';
import downloadFile from '../../../apis/approvalManageAPI/downloadFile';
import getFileNames from '../../../apis/approvalManageAPI/getFileNames';
import Button from '../../common/Button';
import { BiDownload } from 'react-icons/bi';
import { useAlert } from '../../../contexts/AlertContext';

export default function DetailForm(props) {
  const navigate = useNavigate();
  const [default_form, setDefaultForm] = useState('');
  const [userName, setUserName] = useState('');
  const [deptName, setDeptName] = useState('');
  const [productNum, setProductNum] = useState('');
  const [approvalDate, setApprovalDate] = useState('');
  const [enforcementDate, setEnforcementDate] = useState('');
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [approval_line, setApprovalLine] = useState('');
  const [receiveRefOpt, setReceiveRefOpt] = useState('');
  const { showLoading, hideLoading } = useLoading();
  const [customSign, setCustomSign] = useState('');
  const [files, setFiles] = useState([]);
  const { showAlert } = useAlert();

  const download = (filePath) => {
    showLoading();
    downloadFile(filePath)
      .then((res) => {
        if (res.status === 200) {
          return res.blob();
        } else {
          errorHandle(res);
        }
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filePath;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        hideLoading();
      });
  };
  useEffect(() => {
    showLoading();
    //문서상세조회
    getApprovalDoc(props.approval_doc_id)
      .then((res) => {
        if (res.status === 200) {
          return res.json().then((data) => {
            //console.log(data);
            setDefaultForm(data.defaultForm);
            setUserName(data.userName);
            setDeptName(data.deptName);
            setProductNum(data.productNum);
            setTitle(data.approvalDocTitle);
            setApprovalDate(data.approvalDate);
            setEnforcementDate(data.enforcementDate);
            setContents(data.contents);
            setApprovalLine(data.approvalLineList);
            setReceiveRefOpt(data.receivedRefList);
            props.setFormName(data.formName);
            if (data.docStatus == 'T') {
              props.setIsTemporal(true);
            }
            props.setVersion(data.version);
          });
        } else {
          errorHandle(res);
          navigate(`/`);
        }
      })
      .catch(() => {
        showAlert({
          severity: 'error',
          message: '문서를 찾을 수 없습니다',
        });
        hideLoading();
        navigate('/');
      })
      .finally(() => {
        hideLoading();
      });

    //파일 조회
    getFileNames(props.approval_doc_id)
      .then((res) => {
        setFiles(res);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        hideLoading();
      });

    deleteContentEditableError();
  }, [props.reload]);

  const renderApproval = (approval) => {
    // console.log(approval);
    if (
      approval &&
      approval.approvalStatus === 'A' &&
      approval.signFileId === 0
    ) {
      return (
        <>
          <div>
            <DefaultSign name={approval.user} />
          </div>
          <div className={styled.approvalDate}>
            결재일:{approval.approvalDate}
          </div>
          {approval.user}
        </>
      );
    } else if (
      approval &&
      approval.approvalStatus === 'A' &&
      approval.signFileId !== 0
    ) {
      getApproverSign(approval.signFileId)
        .then((response) => {
          setCustomSign(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
      return (
        <>
          <div>
            <img className={styled.custom_sign} src={customSign} alt="사인" />
          </div>
          <div className={styled.approvalDate}>
            결재일:{approval.approvalDate}
          </div>
          {approval.user}
        </>
      );
    } else if (
      approval &&
      approval.approvalStatus === 'R' &&
      approval.signFileId === 0
    ) {
      return (
        <div className={styled.container}>
          <DefaultSign name={approval.user} />
          <div className={styled.returnSticker}>반려</div>
          <div className={styled.approvalDate}>
            반려일:{approval.approvalDate}
          </div>
          {approval.user}
        </div>
      );
    } else if (
      approval &&
      approval.approvalStatus === 'R' &&
      approval.signFileId !== 0
    ) {
      getApproverSign(approval.signFileId)
        .then((response) => {
          setCustomSign(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
      return (
        <>
          <div>
            <img className={styled.custom_sign} src={customSign} alt="사인" />
          </div>
          <div className={styled.returnSticker}>반려</div>
          {/* <div className={styled.reject}>반려</div> */}
          <div className={styled.approvalDate}>
            반려일:{approval.approvalDate}
          </div>
          {approval.user}
        </>
      );
    } else if (approval) {
      return <>{approval.user}</>;
    }
  };

  return (
    <>
      <div className={styled.detailformContainer}>
        {ReactHtmlParser(default_form, {
          replace: (domNode) => {
            if (domNode.attribs && domNode.attribs.id == 'approval_line') {
              return (
                <table
                  border={'1px solid'}
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    height: '100%',
                  }}
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
                  <tr>
                    {[...Array(8)].map((_, index) => {
                      const sortedApprovalLine = approval_line.sort(
                        (a, b) => a.approvalOrder - b.approvalOrder
                      );
                      return (
                        <td
                          style={{
                            textAlign: 'center',
                            width: '12.5%',
                            height: '70px',
                          }}
                          key={index}
                        >
                          {renderApproval(sortedApprovalLine[index])}
                        </td>
                      );
                    })}
                  </tr>
                </table>
              );
            }
            if (domNode.attribs && domNode.attribs.id === 'doc_num') {
              return (
                <div id="doc_num" contentEditable="false">
                  {productNum}
                </div>
              );
            }
            if (domNode.attribs && domNode.attribs.id === 'drafting_time') {
              return (
                <div id="drafting_time" contentEditable="false">
                  {approvalDate}
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
                <div id="form_title" contentEditable="false">
                  {title}
                </div>
              );
            }
            if (domNode.attribs && domNode.attribs.id == 'enforce_date') {
              return (
                <div id="enforce_date" contentEditable="false">
                  {enforcementDate}
                </div>
              );
            }
            if (domNode.attribs && domNode.attribs.id == 'rec_ref') {
              return (
                <>
                  {receiveRefOpt.map((data, index) => (
                    <div id="receiveList" key={index}>
                      {data.category === 'U'
                        ? data.user
                        : data.category === 'D'
                        ? data.department
                        : data.category === 'E'
                        ? data.establishment
                        : data.category === 'C'
                        ? data.company
                        : null}
                    </div>
                  ))}
                </>
              );
            }
            if (domNode.attribs && domNode.attribs.id == 'enforcer') {
              return <div id="enforcer" contentEditable="false"></div>;
            }
            if (domNode.attribs && domNode.attribs.id == 'content') {
              return (
                <>
                  <div id="content" contentEditable="false">
                    {ReactHtmlParser(contents)}
                  </div>
                </>
              );
            }
          },
        })}
      </div>

      <div className={styled.downloadFile}>
        {files.map((ele) => (
          <div key={ele.id} className={styled.Filepath}>
            <span style={{ paddingRight: '5px', fontSize: '14px' }}>
              첨부파일 : {ele.fileName}
            </span>
            <Button
              onClick={() => download(ele.downloadFilePath)}
              btnStyle="nonstyle_btn"
              fontSize="30px"
              height="30px"
              width="30px"
              label={<BiDownload size="30px" />}
            ></Button>
          </div>
        ))}
      </div>
    </>
  );
}
