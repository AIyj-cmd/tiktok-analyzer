import React, { createContext, useState, useContext, useEffect } from 'react';

// Create auth context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is saved in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (username, password) => {
    // We don't need to call the API here - that's done in the login page
    // We just need to update the state based on the successful login
    
    // Create user object
    const user = { username, isAdmin: username === 'admin' };
    
    // Update state and localStorage
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    return true;
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  // Check if user is admin
  const isAdmin = () => {
    return currentUser?.isAdmin === true;
  };

  const value = {
    currentUser,
    login,
    logout,
    isAdmin,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
}; 