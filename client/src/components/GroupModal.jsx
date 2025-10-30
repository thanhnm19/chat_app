import React, { useState, useEffect } from 'react';
//import authService from '../services/authService';
import authService from '../services/mockAuthService';
import { useSocket } from '../context/SocketContext';
import '../styles/GroupModal.css';

const GroupModal = ({ onClose, onCreate }) => {
  const { isUserOnline } = useSocket();
  const [groupName, setGroupName] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await authService.getAllUsers();
      setUsers(response);//response.data || []
    } catch (err) {
      setError('Không thể tải danh sách người dùng');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserToggle = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!groupName.trim()) {
      setError('Vui lòng nhập tên nhóm');
      return;
    }
    
    if (selectedUsers.length < 2) {
      setError('Vui lòng chọn ít nhất 2 thành viên');
      return;
    }

    onCreate({
      name: groupName.trim(),
      memberIds: selectedUsers
    });
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="modal-overlay desktop" onClick={onClose}>
      <div className="modal-content group-modal-desktop" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header desktop-header">
          <h3>Tạo nhóm mới</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Group Name Input */}
          <div className="form-group">
            <label htmlFor="groupName">Tên nhóm *</label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Nhập tên nhóm..."
              maxLength={50}
              autoFocus
            />
          </div>

          {/* Search Users */}
          <div className="form-group">
            <label>Thêm thành viên (đã chọn: {selectedUsers.length})</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm người dùng..."
            />
          </div>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Users List */}
          <div className="users-selection-list">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Đang tải...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="empty-state">
                <p>Không tìm thấy người dùng</p>
              </div>
            ) : (
              filteredUsers.map(user => (
                <div
                  key={user._id}
                  className={`user-selection-item ${
                    selectedUsers.includes(user._id) ? 'selected' : ''
                  }`}
                  onClick={() => handleUserToggle(user._id)}
                >
                  <div className="user-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => {}}
                    />
                  </div>
                  <div className="user-avatar">
                    {user.avatar || '👤'}
                    {isUserOnline(user._id) && (
                      <span className="online-indicator"></span>
                    )}
                  </div>
                  <div className="user-info">
                    <h4>{user.username}</h4>
                    <p className="user-status">
                      {isUserOnline(user._id) ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Action Buttons */}
          <div className="modal-actions">
            <button 
              type="button" 
              onClick={onClose}
              className="btn btn-cancel"
            >
              Hủy
            </button>
            <button 
              type="submit"
              className="btn btn-create"
              disabled={!groupName.trim() || selectedUsers.length < 2}
            >
              Tạo nhóm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupModal;