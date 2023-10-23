import React, { useState, useEffect } from 'react';
import ReactHtmlParser from 'html-react-parser';
import { useNavigate } from 'react-router-dom';
import DefaultSign from '../../userinfo/DefaultSign';
import getApprovalDoc from '../../../apis/approvalManageAPI/getApprovalDoc';
import deleteContentEditableError from '../../../apis/approvalManageAPI/deleteContentEditableError';
import { useLoading } from '../../../contexts/LoadingContext';
import { getSign } from '../../../apis/userInfoAPl/getSign';
import styled from '../../../styles/components/approvalManage/approvalDetail/DetailForm.module.css';
import errorHandle from '../../../apis/errorHandle';

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

  useEffect(() => {
    showLoading();
    //문서상세조회
    getApprovalDoc(props.approval_doc_id)
      .then((res) => {
        if (res.status === 200) {
          return res.json().then((data) => {
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
            if (data.docStatus == 'T') {
              props.setIsTemporal(true);
            }
          });
        } else {
          errorHandle(res);
          navigate(`/`);
        }
      })

      .catch(() => {
        alert('문서를 찾을 수 없습니다');
        hideLoading();
        navigate('/');
      })
      .finally(() => {
        hideLoading();
      });

    deleteContentEditableError();
  }, []);

  const renderApproval = (approval) => {
    //console.log(approval);
    if (
      approval &&
      (approval.approvalStatus === 'R' || approval.approvalStatus === 'A') &&
      approval.signState === 0
    ) {
      return (
        <>
          <div>
            <DefaultSign name={approval.user} />
          </div>
          {approval.user}
        </>
      );
    } else if (
      approval &&
      (approval.approvalStatus === 'R' || approval.approvalStatus === 'A') &&
      approval.signState === 1
    ) {
      getSign()
        .then((response) => {
          console.log(response);
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
          {approval.user}
        </>
      );
    } else if (approval) {
      return approval.user;
    }
  };

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
                          }}
                          key={index}
                        >
                          {renderApproval(approval_line[index])}
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
                  <h4>신청내용</h4>
                  <div id="content" contentEditable="false">
                    {ReactHtmlParser(contents)}
                  </div>
                </>
              );
            }
          },
        })}
      </div>
    </>
  );
}
