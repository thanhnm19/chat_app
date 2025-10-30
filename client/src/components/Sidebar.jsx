import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
//import authService from '../services/authService';
import authService from '../services/mockAuthService';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import '../styles/Sidebar.css';

const Sidebar = ({ 
  conversations, 
  selectedConversation, 
  onSelectConversation,
  onCreateConversation,
  onCreateGroup,
  loading 
}) => {
  const { isUserOnline } = useSocket();
  const [showUserList, setShowUserList] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Load danh sách users khi mở modal
  useEffect(() => {
    if (showUserList) {
      loadUsers();
    }
  }, [showUserList]);

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const data = await authService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleUserSelect = (userId) => {
    onCreateConversation(userId);
    setShowUserList(false);
    setSearchQuery('');
  };

  const filteredConversations = conversations.filter(conv => {
    const name = conv.isGroup ? conv.name : conv.otherUser?.username || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getConversationName = (conversation) => {
    if (conversation.isGroup) {
      return conversation.name;
    }
    return conversation.otherUser?.username || 'Unknown';
  };

  const getConversationAvatar = (conversation) => {
    if (conversation.isGroup) {
      return '👥';
    }
    return conversation.otherUser?.avatar || '👤';
  };

  const getLastMessagePreview = (conversation) => {
    if (!conversation.lastMessage) return 'Chưa có tin nhắn';
    
    const msg = conversation.lastMessage;
    if (msg.type === 'image') return '📷 Hình ảnh';
    if (msg.type === 'file') return '📎 File';
    return msg.content;
  };

  const getLastMessageTime = (conversation) => {
    if (!conversation.lastMessage) return '';
    
    try {
      return formatDistanceToNow(new Date(conversation.lastMessage.createdAt), {
        addSuffix: true,
        locale: vi
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="sidebar">
      {/* Search & Actions */}
      <div className="sidebar-header">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm cuộc trò chuyện..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="action-buttons">
          <button 
            className="action-btn"
            onClick={() => setShowUserList(true)}
            title="Bắt đầu trò chuyện mới"
          >
            ✉️
          </button>
          <button 
            className="action-btn"
            onClick={onCreateGroup}
            title="Tạo nhóm mới"
          >
            👥
          </button>
        </div>
      </div>

      {/* Conversations List */}
      <div className="conversations-list">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Đang tải...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="empty-state">
            <p>🔍</p>
            <p>Không tìm thấy cuộc trò chuyện</p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <div
              key={conversation._id}
              className={`conversation-item ${
                selectedConversation?._id === conversation._id ? 'active' : ''
              }`}
              onClick={() => onSelectConversation(conversation)}
            >
              <div className="conversation-avatar">
                {getConversationAvatar(conversation)}
                {!conversation.isGroup && isUserOnline(conversation.otherUser?._id) && (
                  <span className="online-indicator"></span>
                )}
              </div>
              
              <div className="conversation-info">
                <div className="conversation-header">
                  <h4>{getConversationName(conversation)}</h4>
                  <span className="last-message-time">
                    {getLastMessageTime(conversation)}
                  </span>
                </div>
                <div className="conversation-footer">
                  <p className="last-message">
                    {getLastMessagePreview(conversation)}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <span className="unread-badge">{conversation.unreadCount}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* User List Modal */}
      {showUserList && (
        <div className="modal-overlay" onClick={() => setShowUserList(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chọn người để trò chuyện</h3>
              <button 
                className="close-btn"
                onClick={() => setShowUserList(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              {loadingUsers ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Đang tải...</p>
                </div>
              ) : (
                <div className="users-list">
                  {users.map((user) => (
                    <div
                      key={user._id}
                      className="user-item"
                      onClick={() => handleUserSelect(user._id)}
                    >
                      <div className="user-avatar">
                        {user.avatar || '👤'}
                        {isUserOnline(user._id) && (
                          <span className="online-indicator"></span>
                        )}
                      </div>
                      <div className="user-info">
                        <h4>{user.username}</h4>
                        <p className="user-status">
                          {isUserOnline(user._id) ? ' Online' : ' Offline'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;