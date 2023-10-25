import React, { createContext, useState, useContext, useEffect } from 'react';

const initialState = {
  isLoggedIn: true,
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
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
