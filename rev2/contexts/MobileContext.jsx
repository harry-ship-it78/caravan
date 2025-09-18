import React, { createContext, useContext, useState } from 'react';

const MobileContext = createContext();

export const MobileProvider = ({ children }) => {
  const [isMobileMode, setIsMobileMode] = useState(false);

  const toggleMobileMode = () => {
    setIsMobileMode(prev => !prev);
  };

  return (
    <MobileContext.Provider value={{ isMobileMode, toggleMobileMode }}>
      {children}
    </MobileContext.Provider>
  );
};

export const useMobile = () => {
  const context = useContext(MobileContext);
  if (!context) {
    throw new Error('useMobile must be used within a MobileProvider');
  }
  return context;
};