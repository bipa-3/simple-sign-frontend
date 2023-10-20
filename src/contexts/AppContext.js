import React, { createContext, useState, useEffect, useContext } from 'react';

const initialState = {
  isLoggedIn: false,
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, setState] = useState({
    isLoggedIn: JSON.parse(localStorage.getItem('isLoggedIn')) || false,
  });

  useEffect(() => {
    localStorage.setItem('isLoggedIn', JSON.stringify(state.isLoggedIn));
  }, [state.isLoggedIn]);

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
