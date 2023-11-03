import React from 'react';
import styles from '../../styles/components/common/InnerBox.module.css';
import Title from './Title';

/**
 *
 * @param {String} width innerBox의 X축 크기 ex) 18px or 10%
 * @param {String} height innerBox의 Y축 크기 ex) 18px or 10%
 * @param {String} text innerBox의 타이틀 ex) 양식상세
 * @param {String} font_size innerBox 타이틀의 크기 ex) 18px or 10%
 * @param {Component} titleChildren innerBox 타이틀 영역의 컴포넌트 ex) <Button/>
 * @param {String} childStyle innerBox children의 스타일 ex) {border: 1px solid #000, background: #000}
 * @param {Component} children innerBox 컨텐트 영역의 컴포넌트 ex) <FormList>
 * @returns
 */
export default function InnerBox(props) {
  const innerBoxStyle = {
    width: props.width,
    height: props.height,
  };

  return (
    <div className={styles.box} style={innerBoxStyle}>
      <div className={styles.titleArea}>
        {props.text ? (
          <Title
            text={props.text}
            font_size={props.font_size}
            marginLeft={props.marginLeft}
          />
        ) : null}
        <div className={styles.titleChildrenBox}>
          {props.titleChildren ? props.titleChildren : null}
        </div>
      </div>
      {props.text !== null && props.text !== undefined ? <hr /> : null}
      <div style={props.childStyle}>{props.children}</div>
    </div>
  );
}
