import React from 'react';
import { useAlarm } from '../../../contexts/AlarmContext';
import pen from '../../../assets/imgs/pen.png';
import styled from '../../../styles/components/home/TimeLine.module.css';
import { GrDocumentText } from 'react-icons/gr';
import TextsmsIcon from '@mui/icons-material/Textsms';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function TimeLineList() {
  const { notifications } = useAlarm();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${month}월 ${day}일 ${hours}:${minutes
      .toString()
      .padStart(2, '0')}`;
  };

  const handleContent = (approvalDocId) => {
    const popupOptions = 'width=1200,height=700,left=100,top=100';
    window.open(`/AD?page=${approvalDocId}&popup=true`, '_blank', popupOptions);
  };

  const group = (notifications) => {
    const groups = {};
    notifications.forEach((notification) => {
      const date =
        formatDate(notification.alarmDate).split(' ')[0] +
        formatDate(notification.alarmDate).split(' ')[1];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
    });
    return groups;
  };

  const notificationGroups = group(notifications);

  return (
    <div className={styled.contanier}>
      {Object.keys(notificationGroups).map((date) => (
        <React.Fragment key={date}>
          <div className={styled.timeline_date}>{date}</div>
          {notificationGroups[date].map((notification, index) => (
            <div key={notification.alarmId}>
              <div className={styled.content}>
                {notification.alarmCode === '04' ||
                notification.alarmCode === '07' ? (
                  <div className={styled.timeline_stamp}>
                    <TextsmsIcon />
                  </div>
                ) : notification.alarmCode === '01' ? (
                  <img src={pen} className={styled.timeline_img} />
                ) : notification.alarmCode === '02' ? (
                  <div className={styled.timeline_stamp}>
                    <CheckCircleOutlineIcon />
                  </div>
                ) : (
                  <div className={styled.timeline_icon}>{GrDocumentText()}</div>
                )}
                <div
                  className={styled.timeline_content}
                  onClick={() => {
                    handleContent(notification.approvalDocId);
                  }}
                >
                  {notification.alarmContent}
                </div>
              </div>
              <div className={styled.timeline_time}>
                [문서명] {notification.approvalDocTitle}
                {'  |  '}
                {formatDate(notification.alarmDate).split(' ')[2]}
              </div>
              {index < notificationGroups[date].length - 1 && (
                <div className={styled.timeline_line}> | </div>
              )}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}
