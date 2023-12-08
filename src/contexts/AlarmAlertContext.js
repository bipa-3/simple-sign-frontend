import React, { createContext, useContext, useState, useEffect } from 'react';
import AlarmAlert from '../components/common/AlarmAlert';

const AlarmAlertContext = createContext();

let initAlertDatas = {
  open: false,
  severity: '',
  message: '',
};

export const AlarmAlertProvider = ({ children }) => {
  const [alertInfo, setAlertInfo] = useState(initAlertDatas);

  const showAlarmAlert = (data) => {
    setAlertInfo({ open: true, ...data });
  };

  const hideAlert = () => {
    setAlertInfo(initAlertDatas);
  };

  useEffect(() => {
    if (alertInfo.open) {
      const timer = setTimeout(() => {
        handleClose();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [alertInfo]);

  function handleClose() {
    setAlertInfo({ ...alertInfo, open: false });
  }

  const renderAlarmAlert = () => {
    return (
      <AlarmAlert
        severity={alertInfo.severity}
        message={alertInfo.message}
        open={alertInfo.open}
        close={() => {
          handleClose();
        }}
      />
    );
  };

  return (
    <AlarmAlertContext.Provider
      value={{ alertInfo, showAlarmAlert, hideAlert, renderAlarmAlert }}
    >
      {children}
    </AlarmAlertContext.Provider>
  );
};

export const useAlarmAlert = () => {
  return useContext(AlarmAlertContext);
};
