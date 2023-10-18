import React from 'react';
import styles from '../../styles/components/common/Button.module.css';

/**
 *
 * @param {Function} onClick 클릭 이벤트 ex) clickHandler
 * @param {String} label 버튼 텍스트 ex) '추가'
 * @param {String} btnStyle 버튼 스타일 ex) blue_btn, gray_btn, popup_blue_btn, popup_gray_btn, popup_non_btn, green_btn, red_btn, dark_btn
 * @param {String} width 버튼 가로 길이 ex) '100px'
 * @param {String} height 버튼 세로 길이 ex) '50px'
 * @param {String} fontSize 버튼 글자 크기 ex) '12px'
 * @returns
 */
function Button(props) {
  const buttonSize = {
    width: props.width,
    height: props.height,
    fontSize: props.fontSize,
  };
  return (
    <button
      onClick={props.onClick}
      className={styles[props.btnStyle]}
      style={buttonSize}
    >
      {props.label}
    </button>
  );
}

Button.defaultProps = {
  width: '65px',
  height: '30px',
  fontSize: '12px',
};

export default Button;
