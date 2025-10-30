import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <div className="App">
            <Routes>
              {/* Route công khai */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Route được bảo vệ - cần đăng nhập */}
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                }
              />
              
              {/* Redirect mặc định */}
              <Route path="/" element={<Navigate to="/chat" replace />} />
              
              {/* 404 - Redirect về chat */}
              <Route path="*" element={<Navigate to="/chat" replace />} />
            </Routes>
          </div>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;