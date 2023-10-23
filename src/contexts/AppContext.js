import React, { createContext, useState, useContext, useEffect } from 'react';

const initialState = {
  isLoggedIn: false,
};

const AppContext = createContext();

function getCookie(name) {
  const value = ';' + document.cookie;
  const parts = value.split(';' + name + '=');
  return parts.pop().split(';')[0];
}

export const AppProvider = ({ children }) => {
  // const sessionCookie = getCookie('LOGIN_COOKIE');

  const [state, setState] = useState(initialState);

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('Cannot find useApp');
  }
  return context;
}

export default AppContext;
