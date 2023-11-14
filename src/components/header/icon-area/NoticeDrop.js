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
import { getAlarm } from '../../../apis/alarm/getAlarm';
import { getAlarmCount } from '../../../apis/alarm/getAlarm';
import { putAlarmUpdate } from '../../../apis/alarm/putAlarmUpdate';
import alarm_base_url from '../../../apis/alarm_base_url';
import { useAlarm } from '../../../contexts/AlarmContext';

export default function Notice() {
  const [stompClient, setStompClient] = useState(null);
  const { notifications, setNotifications } = useAlarm();
  const [unreadCount, setUnreadCount] = useState(0);

  const socketUrl = `https://ec2-43-202-224-51.ap-northeast-2.compute.amazonaws.com/ws`;

  const initializeWebSocket = () => {
    const socket = new SockJS(socketUrl, null, {
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

  useEffect(() => {
    //initializeWebSocket();
    (async () => {
      try {
        const response = await getAlarm();
        setNotifications(response.data);
      } catch (error) {
        console.error('알림 데이터를 가져오는데 실패했습니다', error);
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
  }, [setNotifications]);

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
              <div className={styles.circle}>{unreadCount}</div>
            </div>
          </Button>
          <Menu className={styles.notice_menubox} {...bindMenu(popupState)}>
            {notifications.map((notification, index) => (
              <MenuItem
                key={index}
                className={styles.menuItemSpacing}
                onClick={() => {
                  markAsRead(notification.alarmId);

                  const popupOptions = 'width=1200,height=700,left=100,top=100';
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
                <div className={styles.alarm_container}>
                  <div className={styles.alarm_content}>
                    {notification.alarmContent}
                  </div>
                  <div className={styles.approval_doc_title}>
                    [문서명] : {notification.approvalDocTitle}
                  </div>
                  <div>{notification.alarmDate}</div>
                </div>
              </MenuItem>
            ))}
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
}
