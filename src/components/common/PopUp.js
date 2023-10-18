import React, { useState } from 'react';
import Button from './Button';
import Modal from '@mui/material/Modal';
import styles from '../../styles/components/common/PopUp.module.css';
/**
 * 
 * @param {String} width 팝업창 가로 크기 ex) 500px or 80% 
 * @param {String} height 팝업창 세로 크기 ex) 500px or 80% 
 * @param {Boolean} isModalOpen const [isModalOpen, setIsModalOpen] = useState(false);
 * @param {Function} openModal const openModal = () => { setIsModalOpen(true) };
 * @param {Function} closeModal const closeModal = () => { setIsModalOpen(false) };
 * @param {Component} children <>
            <div className={styles.contentContainer}>
              <div>{props.children}</div>
            </div>
            <PopUpFoot buttons={grayAndBlueBtn} />
          </>
 * @returns 
 */
export default function PopUp(props) {
  const popUpStyle = {
    width: props.width,
    height: props.height,
  };

  return (
    <div>
      <Button
        onClick={props.openModal}
        btnStyle={props.btnStyle}
        label={props.label}
        width={props.btnWidth}
        height={props.btnHeight}
      ></Button>
      <Modal open={props.isModalOpen} onClose={props.closeModal}>
        <div className={styles.popUpContainer} style={popUpStyle}>
          <div className={styles.header}>{props.title}</div>
          {props.children}
        </div>
      </Modal>
    </div>
  );
}
