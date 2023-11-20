import React from 'react';
import styled from '../../styles/components/common/LoadingAlarm.module.css';
import loadingGif from '../../assets/imgs/loading.gif';

const LoadingAlarm = ({ alarmLoading }) => {
  if (!alarmLoading) return null;

  return (
    <div className={styled.loading_overlay}>
      <img src={loadingGif} alt="로딩 중" className={styled.loading_image} />
    </div>
  );
};

export default LoadingAlarm;
