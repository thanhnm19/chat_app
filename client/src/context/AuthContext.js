import React, { createContext, useState, useContext, useEffect } from 'react';
//import authService from '../services/authService';
import authService from '../services/mockAuthService';
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kiểm tra user đã đăng nhập khi khởi động app
  useEffect(() => {
    const initAuth = () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Đăng ký
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(userData);
      setUser(response);
      return response;
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Đăng nhập
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      setUser(response);
      return response;
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Đăng xuất
  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  // Cập nhật thông tin user
  const updateUser = async (userId, userData) => {
    try {
      setLoading(true);
      const response = await authService.updateUser(userId, userData);
      setUser(prev => ({ ...prev, ...response }));
      return response;
    } catch (err) {
      setError(err.message || 'Cập nhật thất bại');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateUser,
    clearError: () => setError(null)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};