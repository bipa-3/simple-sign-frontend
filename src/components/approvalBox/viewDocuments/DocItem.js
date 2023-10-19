import styled from '../../../styles/components/ApprovalBox/DocItem.module.css';
import defaultUserIcon from '../../../assets/imgs/default_user.png';
import React from 'react';

function DocItem(props) {
  const elementTextStyle = props.isRead ? { color: 'lightgray' } : {};

  //문서상태에 따른 글자색
  const getBgColor = () => {
    if (props.docStatus === 'A') {
      return '#1abc9c';
    } else if (props.docStatus === 'P') {
      return '#46A3F0';
    } else if (props.docStatus === 'R') {
      return '#f1556c';
    } else if (props.docStatus === 'W') {
      return '#f7b84b';
    } else {
      return '';
    }
  };

  const getStatusText = () => {
    switch (props.docStatus) {
      case 'A':
        return '승인'; // 종결 텍스트
      case 'P':
        return '진행'; // 진행 텍스트
      case 'R':
        return '반려'; // 반려 텍스트
      case 'W':
        return '상신'; // 상신 텍스트
      default:
        return ''; // 기본값 (아무 텍스트도 표시하지 않음)
    }
  };

  const bgColor = getBgColor();

  return (
    <div style={{ width: '100%' }}>
      <div className={styled.itembox} onClick={props.onClick}>
        {/* <div className={styled.checkboxArea}>
              <input type="checkbox"></input>
            </div> */}
        <div className={styled.dateText}>{props.date}</div>
        <div className={styled.element}>
          <div className={styled.elementText} style={elementTextStyle}>
            <span>{props.title}</span>
          </div>
          <div className={styled.info}>
            <div className={styled.txtinfo}>{props.formName}</div>
            <div className={styled.bar}>|</div>
            <div className={styled.txtinfo}>{props.docNumber}</div>
          </div>
        </div>
        <div className={styled.docUser}>
          <div className={styled.imginfo}>
            <img src={defaultUserIcon} alt="userphoto" />
          </div>
          <div className={styled.userinfo}>
            <div className={styled.name}>{props.sendUser}</div>
            <div className={styled.departementInfo}>
              <div className={styled.departementList}>
                <div className={styled.txtdep}>{props.sendDepart}</div>
                {/* <div className={styled.txtdep}>|</div> */}
                <div className={styled.txtdep}>{props.sendDepartDetail}</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styled.docStatus}>
          <div className={styled.process}>
            <div
              className={styled.txtline}
              style={{ color: 'white', backgroundColor: bgColor }}
            >
              <span>{getStatusText()}</span>
              <span>{'(' + props.lastUser + ')'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DocItem;
