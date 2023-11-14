import React, { createContext, useState, useContext } from 'react';

const initialState = {
  alarmId: 0,
  alarmDate: '',
  confirmationStatus: false,
  alarmCode: '',
  approvalDocId: 0,
  alarmContent: '',
  approvalDocTitle: '',
  orgUserId: 0,
};

const AlarmContext = createContext();

export const AlarmProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  return (
    <AlarmContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </AlarmContext.Provider>
  );
};

export function useAlarm() {
  const context = useContext(AlarmContext);
  if (!context) {
    throw new Error('useAlarm must be used within a AlarmProvider');
  }
  return context;
}

export default AlarmContext;
