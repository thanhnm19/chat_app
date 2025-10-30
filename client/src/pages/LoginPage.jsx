import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated, error, clearError } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true); // true = login, false = register
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: ''
  });
  const [localError, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect nếu đã đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/chat');
    }
  }, [isAuthenticated, navigate]);

  // Clear error khi switch giữa login/register
  useEffect(() => {
    clearError();
    setLocalError('');
  }, [isLogin, clearError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setLocalError('');
    clearError();
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setLocalError('Vui lòng điền đầy đủ thông tin');
      return false;
    }

    if (!isLogin) {
      if (!formData.username) {
        setLocalError('Vui lòng nhập tên người dùng');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setLocalError('Mật khẩu xác nhận không khớp');
        return false;
      }
      if (formData.password.length < 6) {
        setLocalError('Mật khẩu phải có ít nhất 6 ký tự');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setLocalError('');

    try {
      let response;
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          username: formData.username
        });
      }
       if (response) {
      console.log("✅ Mock login success, navigating to chat");
      navigate("/chat");   // 👈 ép chuyển sang trang chat sau khi đăng nhập thành công
    }
      // Navigation sẽ được xử lý bởi useEffect khi isAuthenticated thay đổi
    } catch (err) {
      setLocalError(err.message || 'Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      username: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>💬 Chat App</h1>
          <p>{isLogin ? 'Đăng nhập để bắt đầu trò chuyện' : 'Tạo tài khoản mới'}</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="username">Tên người dùng</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nhập tên của bạn"
                disabled={loading}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              disabled={loading}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu"
                disabled={loading}
              />
            </div>
          )}

          {(localError || error) && (
            <div className="error-message">
              {localError || error}
            </div>
          )}

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập' : 'Đăng ký')}
          </button>
        </form>

        <div className="toggle-mode">
          <p>
            {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
            <button onClick={toggleMode} disabled={loading}>
              {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;