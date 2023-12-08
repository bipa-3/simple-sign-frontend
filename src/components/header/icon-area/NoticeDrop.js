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
import DeleteIcon from '@mui/icons-material/Delete';
import { useAlert } from '../../../contexts/AlertContext';
import { useAlarmAlert } from '../../../contexts/AlarmAlertContext';

export default function Notice({ onStompClient }) {
  const [stompClient, setStompClient] = useState(null);
  const { notifications, setNotifications } = useAlarm();
  const { showAlert } = useAlert();
  const [unreadCount, setUnreadCount] = useState(0);
  const [alarmLoading, setAlarmLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const { showAlarmAlert } = useAlarmAlert();

  useEffect(() => {
    onStompClient(stompClient);
  }, [stompClient, onStompClient]);

  const socketUrl =
    //`http://localhost:8081/api/alarm/ws`;
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
      // 이미 구독이 있다면 새로 구독하지 않는다.
      if (subscription) {
        subscription.unsubscribe();
        return;
      }
      const newSubscription = client.subscribe(
        `/topic/alarm/${getOrgUserId()}`,
        (message) => {
          const newNotification = JSON.parse(message.body);
          setNotifications((prevNotifs) => [newNotification, ...prevNotifs]);
          localStorage.setItem('lastAlarmId', newNotification.alarmId);
          // 새 알림이 읽지 않은 상태라면 읽지 않은 알림 개수를 증가시킴
          if (!newNotification.read) {
            setUnreadCount((prevUnreadCount) => prevUnreadCount + 1);
          }
          // 새 알림이 도착했을 때 Alert
          showAlarmAlert({
            open: true,
            severity: 'info',
            message: `${newNotification.alarmContent}`,
          });
        }
      );
      setSubscription(newSubscription);

      // 재연결 시 메시지 전송
      if (
        client &&
        client.connected &&
        localStorage.getItem('lastAlarmId') != null
      ) {
        const lastAlarmId = localStorage.getItem('lastAlarmId');
        const orgUserId = localStorage.getItem('orgUserId');
        client.publish({
          destination: '/app/alarmMessage',
          body: JSON.stringify({ lastAlarmId, orgUserId }),
        });
      }
    };

    client.onStompError = (frame) => {
      console.error(`Error: ${frame.headers['message']} | Body: ${frame.body}`);
    };

    client.activate();

    setStompClient(client);

    return () => {
      if (client) {
        client.unsubscribe();
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

    const handleOnline = () => {
      console.log('online');
      initializeWebSocket();
    };

    const handleOffline = () => {
      console.log('offline');
      // 클라이언트 비활성화
      if (stompClient) {
        stompClient.deactivate();
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 웹소켓 연결 부분
    initializeWebSocket();

    // 초기 알림 데이터 불러오는 부분
    (async () => {
      setAlarmLoading(true);
      try {
        const response = await getAlarm();
        setNotifications(response.data);
        localStorage.setItem('lastAlarmId', response.data[0].alarmId);
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

    // 컴포넌트 언마운트 시 이벤트 리스너 제거 및 STOMP 클라이언트 비활성화
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);

      if (subscription) {
        subscription.unsubscribe();
        setSubscription(null);
      }

      // 클라이언트 비활성화
      if (stompClient) {
        stompClient.deactivate();
      }
    };
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
      showAlert({
        open: true,
        severity: 'error',
        message: '알림 상태를 업데이트하는데 실패했습니다.',
      });
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
      showAlert({
        open: true,
        severity: 'success',
        message: '알림이 삭제 되었습니다.',
      });
    } catch (error) {
      showAlert({
        open: true,
        severity: 'error',
        message: '알람 삭제에 실패했습니다',
      });
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
                  style={{ borderBottom: '2px solid #ececec', margin: '10px' }}
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
                >
                  <button
                    className={styles.notice_button}
                    onClick={(event) =>
                      deleteAlarmAPI(event, notification.alarmId)
                    }
                  >
                    <DeleteIcon className={styles.notice_button_icon} />
                  </button>
                  <div className={styles.alarm_container}>
                    <div
                      className={
                        notification.confirmationStatus
                          ? styles.alarm_content_read
                          : styles.alarm_content
                      }
                    >
                      {notification.alarmContent}
                    </div>
                    <div
                      className={
                        notification.confirmationStatus
                          ? styles.approval_doc_title_read
                          : styles.approval_doc_title
                      }
                    >
                      [문서명] : {notification.approvalDocTitle}
                    </div>
                    <div
                      className={
                        notification.confirmationStatus
                          ? styles.alarm_user_name_read
                          : styles.alarm_user_name
                      }
                    >
                      {notification.alarmCode === '02'
                        ? `[결재자] : ${notification.userName}`
                        : null}
                    </div>
                    <div
                      className={
                        notification.confirmationStatus
                          ? styles.alarm_date_read
                          : styles.alarm_date
                      }
                    >
                      {
                        // 현재 날짜를 가져옵니다.
                        new Date().toDateString() ===
                        new Date(notification.alarmDate).toDateString()
                          ? `${
                              formatDate(notification.alarmDate).split(' ')[0]
                            } ${
                              formatDate(notification.alarmDate).split(' ')[1]
                            } ${
                              formatDate(notification.alarmDate).split(' ')[2]
                            }`
                          : `${
                              formatDate(notification.alarmDate).split(' ')[0]
                            } ${
                              formatDate(notification.alarmDate).split(' ')[1]
                            }`
                      }
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
