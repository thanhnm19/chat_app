import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Đang loading thì hiển thị loading spinner
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  // Chưa đăng nhập thì redirect về login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Đã đăng nhập thì render children
  return children;
};

export default ProtectedRoute;