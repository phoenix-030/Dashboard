import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from './authService';

let AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const session = authService.getSession();
    if (session && session.isAuthenticated) {
      setUser(session);
    }
    setLoading(false);
  }, []);

  //login check pannum  local storage al data irukanu
  const login = async (email, password) => {
    try {
      const session = authService.login(email, password);
      setUser(session);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };


  // signup

  const signUp = async (name, email, password) => {
    try {
      const result = authService.signUp(name, email, password);
      // Don't set user session after signup - user needs to login
      return { success: true, message: result.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
//logout

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    signUp,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
