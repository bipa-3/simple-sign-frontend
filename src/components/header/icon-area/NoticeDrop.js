import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import styles from '../../../styles/components/header/dropdown.module.css';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getOrgUserId } from '../../../utils/getUser';
import { getAlarm, getSession } from '../../../apis/alarm/getAlarm';
import { getAlarmCount } from '../../../apis/alarm/getAlarm';
import { putAlarmUpdate } from '../../../apis/alarm/putAlarmUpdate';
import { useAlarm } from '../../../contexts/AlarmContext';
import { deleteAlarm } from '../../../apis/alarm/deleteAlarm';
import { FiBellOff } from 'react-icons/fi';
import LoadingAlarm from '../../common/LoadingAlarm';

export default function Notice() {
  const [stompClient, setStompClient] = useState(null);
  const { notifications, setNotifications } = useAlarm();
  const [unreadCount, setUnreadCount] = useState(0);
  const [alarmLoading, setAlarmLoading] = useState(false);

  const socketUrl =
    //`http://localhost:8081/alarm/ws`||
    `https://ec2-43-202-224-51.ap-northeast-2.compute.amazonaws.com/alarm/ws`;
  const initializeWebSocket = () => {
    const socket = new SockJS(socketUrl, null, {
      transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
      withCredentials: true,
    });

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => {
        console.log(str);
      },
    });

    client.onConnect = () => {
      client.subscribe(`/topic/alarm/${getOrgUserId()}`, (message) => {
        const newNotification = JSON.parse(message.body);
        setNotifications((prevNotifs) => [newNotification, ...prevNotifs]);

        // 새 알림이 읽지 않은 상태라면 읽지 않은 알림 개수를 증가시킵니다.
        if (!newNotification.read) {
          setUnreadCount((prevUnreadCount) => prevUnreadCount + 1);
        }
      });
    };

    client.onStompError = (frame) => {
      console.error(`Error: ${frame.headers['message']} | Body: ${frame.body}`);
    };

    client.activate();

    setStompClient(client);

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  };

  // const [sessionId, setSessionId] = useState(null);

  // useEffect(() => {
  //   const getCookies = () => {
  //     const cookies = document.cookie.split(';');
  //     const cookieMap = {};

  //     for (const cookie of cookies) {
  //       const [name, value] = cookie.trim().split('=');
  //       cookieMap[name] = value;
  //     }

  //     return cookieMap;
  //   };
  //   const cookies = getCookies();

  //   // SESSION_ID 쿠키가 있는지 확인하고 값 설정
  //   if ('JSESSIONID' in cookies) {
  //     setSessionId(cookies.SESSION_ID);
  //   }
  // });

  useEffect(() => {
    // if (sessionId != null) {
    // console.log(sessionId);
    // (async () => {
    //   try {
    //     const response = await getSession(sessionId);
    //     console.log(response.data);
    //   } catch (error) {
    //     console.error('세션 데이터를 가져오는데 실패했습니다', error);
    //   }
    // })();

    initializeWebSocket();
    (async () => {
      setAlarmLoading(true);
      try {
        const response = await getAlarm();
        setNotifications(response.data);
      } catch (error) {
        console.error('알림 데이터를 가져오는데 실패했습니다', error);
      } finally {
        setAlarmLoading(false);
      }
    })();

    // 읽지 않은 알림의 수를 가져오기
    const fetchUnreadCount = async () => {
      try {
        const response = await getAlarmCount();
        setUnreadCount(response.data);
      } catch (error) {
        console.error('알림 카운트를 가져오는데 실패했습니다', error);
      }
    };

    fetchUnreadCount();
  }, []);

  // 알림을 읽음으로 표시하는 함수
  const markAsRead = async (alarmId) => {
    try {
      await putAlarmUpdate(alarmId);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => {
          // 이미 읽음 상태가 아닐 때만 상태를 업데이트하고 unreadCount를 감소시킵니다.
          if (
            notification.alarmId === alarmId &&
            !notification.confirmationStatus
          ) {
            setUnreadCount((prevCount) => prevCount - 1);
            return { ...notification, confirmationStatus: true };
          }
          return notification;
        })
      );
    } catch (error) {
      console.error('알림 상태를 업데이트하는데 실패했습니다', error);
    }
  };

  // 알림 삭제
  const deleteAlarmAPI = async (event, alarmId) => {
    event.stopPropagation();
    try {
      await deleteAlarm(alarmId);
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification.alarmId !== alarmId
        )
      );
      // 읽지 않은 알람 개수 업데이트
      setUnreadCount((prev) => prev - 1);
      alert('삭제되었습니다.');
    } catch (error) {
      console.error('알람 삭제에 실패했습니다', error);
    }
  };

  // 시간 표시
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

  // return (
  //   <div>
  //     <p>SESSION_ID: {sessionId}</p>
  //     <p>LOGIN_COOKIE: {loginCookie}</p>
  //   </div>
  // );
  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment>
          <Button
            variant="contained"
            {...bindTrigger(popupState)}
            className={styles.test}
          >
            <div className={styles.iconcontainer}>
              <NotificationsNoneRoundedIcon
                className={styles.noticeIcon}
              ></NotificationsNoneRoundedIcon>
              <div className={styles.circle}>
                {unreadCount > 100 ? '99+' : unreadCount}
              </div>
            </div>
          </Button>
          <Menu className={styles.notice_menubox} {...bindMenu(popupState)}>
            <LoadingAlarm alarmLoading={alarmLoading} />
            {!alarmLoading && notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <MenuItem
                  key={index}
                  className={styles.menuItemSpacing}
                  onClick={() => {
                    markAsRead(notification.alarmId);

                    const popupOptions =
                      'width=1200,height=700,left=100,top=100';
                    window.open(
                      `/AD?page=${notification.approvalDocId}&popup=true`,
                      '_blank',
                      popupOptions
                    );
                  }}
                  style={{
                    backgroundColor: notification.confirmationStatus
                      ? '#ececec'
                      : 'white',
                  }}
                >
                  <button
                    className={styles.notice_button}
                    onClick={(event) =>
                      deleteAlarmAPI(event, notification.alarmId)
                    }
                  >
                    삭제
                  </button>
                  <div className={styles.alarm_container}>
                    <div className={styles.alarm_content}>
                      {notification.alarmContent}
                    </div>
                    <div className={styles.approval_doc_title}>
                      [문서명] : {notification.approvalDocTitle}
                    </div>
                    <div>
                      {notification.alarmCode === '02'
                        ? notification.userName
                        : null}
                    </div>
                    <div className={styles.alarm_date}>
                      {formatDate(notification.alarmDate).split(' ')[0]}
                      {formatDate(notification.alarmDate).split(' ')[1]}{' '}
                      {formatDate(notification.alarmDate).split(' ')[2]}
                    </div>
                  </div>
                </MenuItem>
              ))
            ) : (
              <div className={styles.notice_box}>
                <FiBellOff />
              </div>
            )}
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
}
