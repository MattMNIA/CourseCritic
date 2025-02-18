import React, { createContext, useState, useContext, useEffect } from 'react';
import userService from '../services/userService';

const AuthContext = createContext(null);

// Define the provider as a regular component first
const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = userService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setCurrentUser(userData);
    userService.setCurrentUser(userData);
  };

  const logout = () => {
    setCurrentUser(null);
    userService.logout();
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Define hook separately
const UseAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('UseAuth must be used within an AuthProvider');
  }
  return context;
};

// Export everything at the end
export { AuthProvider, UseAuth };
