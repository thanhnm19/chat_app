import axios from 'axios';

// Cấu hình base URL - Thay đổi khi có backend
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const authService = {
  // Đăng ký user mới
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Đăng ký thất bại' };
    }
  },

  // Đăng nhập
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Đăng nhập thất bại' };
    }
  },

  // Đăng xuất
  logout: () => {
    localStorage.removeItem('user');
  },

  // Lấy thông tin user hiện tại từ localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Lấy token
  getToken: () => {
    const user = authService.getCurrentUser();
    return user?.token;
  },

  // Kiểm tra đã đăng nhập chưa
  isAuthenticated: () => {
    return !!authService.getToken();
  },

  // Cập nhật thông tin user
  updateUser: async (userId, userData) => {
    try {
      const response = await axios.put(
        `${API_URL}/auth/user/${userId}`,
        userData,
        {
          headers: { Authorization: `Bearer ${authService.getToken()}` }
        }
      );
      
      // Cập nhật localStorage
      const currentUser = authService.getCurrentUser();
      const updatedUser = { ...currentUser, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Cập nhật thất bại' };
    }
  },

  // Lấy danh sách tất cả users (để search, add friend...)
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${authService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể tải danh sách người dùng' };
    }
  }
};

export default authService;