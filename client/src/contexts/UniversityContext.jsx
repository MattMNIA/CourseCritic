import React, { createContext, useState, useContext } from 'react';

export const UniversityContext = createContext();

export const UniversityProvider = ({ children }) => {
  const [currentUniversity, setCurrentUniversity] = useState(() => {
    const saved = localStorage.getItem('currentUniversity');
    return saved ? JSON.parse(saved) : null;
  });

  const updateUniversity = (university) => {
    setCurrentUniversity(university);
    localStorage.setItem('currentUniversity', JSON.stringify(university));
  };

  return (
    <UniversityContext.Provider value={{ currentUniversity, updateUniversity }}>
      {children}
    </UniversityContext.Provider>
  );
};

export const useUniversity = () => {
  const context = useContext(UniversityContext);
  if (!context) {
    throw new Error('useUniversity must be used within a UniversityProvider');
  }
  return context;
};
