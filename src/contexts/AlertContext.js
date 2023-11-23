import React, { createContext, useContext, useState, useEffect } from 'react';
import CustomAlert from '../components/common/CustomAlert';

const AlertContext = createContext();

let initAlertDatas = {
  open: false,
  severity: '',
  message: '',
};

/**
 * showAlert guide
 * @param {String} severity ex) "error" or "success" or "warning" or "info"
 * @param {String} message ex) "요청에 실패했습니다.ㅠㅠ"
 * ex) showAlert({open: true, severity: "error", message: "실패!!"})
 */
export const AlertProvider = ({ children }) => {
  const [alertInfo, setAlertInfo] = useState(initAlertDatas);

  const showAlert = (data) => {
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

  const renderCustomAlert = () => {
    return (
      <CustomAlert
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
    <AlertContext.Provider
      value={{ alertInfo, showAlert, hideAlert, renderCustomAlert }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  return useContext(AlertContext);
};
