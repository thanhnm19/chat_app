import React, { useState, useRef, useEffect } from 'react';
import { useSocket, useTypingListener } from '../context/SocketContext';
import MessageItem from './MessageItem';
import '../styles/ChatWindow.css';

const ChatWindow = ({ conversation, messages, onSendMessage, currentUserId }) => {
  const { sendTyping, isUserOnline } = useSocket();
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [filteredMessages, setFilteredMessages] = useState([]);
  // const [uploadProgress, setUploadProgress] = useState(0);
  // const [isUploading, setIsUploading] = useState(false);
  
  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  // Listen to typing events
  useTypingListener((data) => {
    if (conversation && data.conversationId === conversation._id) {
      if (data.isTyping) {
        setTypingUsers(prev => {
          if (!prev.includes(data.userId)) {
            return [...prev, data.userId];
          }
          return prev;
        });
      } else {
        setTypingUsers(prev => prev.filter(id => id !== data.userId));
      }
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);

    // Send typing indicator
    if (!isTyping && conversation) {
      setIsTyping(true);
      sendTyping(conversation._id, true);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (conversation) {
        sendTyping(conversation._id, false);
      }
    }, 2000);
  };
  const handleSearchToggle = () => {
  setShowSearch(!showSearch);
  if (showSearch) {
    setSearchQuery('');
    setFilteredMessages([]);
  }
};

const handleSearch = (e) => {
  const query = e.target.value;
  setSearchQuery(query);
  
  if (query.trim()) {
    const filtered = messages.filter(message => 
      message.content.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMessages(filtered);
  } else {
    setFilteredMessages([]);
  }
};

const handleInfoToggle = () => {
  setShowInfo(!showInfo);
};
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !conversation) return;

    onSendMessage(inputMessage.trim());
    setInputMessage('');
    
    // Stop typing indicator
    if (isTyping) {
      setIsTyping(false);
      sendTyping(conversation._id, false);
    }

    // Clear timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // TODO: Implement file upload
    console.log('File upload:', file);
    alert('Chức năng upload file đang được phát triển');
  };

  const getConversationName = () => {
    if (!conversation) return '';
    if (conversation.isGroup) {
      return conversation.name;
    }
    return conversation.otherUser?.username || 'Unknown';
  };

  const getOnlineStatus = () => {
    if (!conversation) return '';
    if (conversation.isGroup) {
      const onlineCount = conversation.members?.filter(m => 
        isUserOnline(m._id)
      ).length || 0;
      return `${onlineCount} online`;
    }
    return isUserOnline(conversation.otherUser?._id) ? ' Online' : ' Offline';
  };

  if (!conversation) {
    return (
      <div className="chat-window empty">
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <h3>Chọn một cuộc trò chuyện</h3>
          <p>Chọn từ danh sách bên trái hoặc tạo cuộc trò chuyện mới</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      {/* Chat Header */}
              <div className="chat-window-header">
                <div className="header-info">
                  <div className="conversation-avatar">
                    {conversation.isGroup ? '👥' : (conversation.otherUser?.avatar || '👤')}
                  </div>
                  <div>
                    <h3>{getConversationName()}</h3>
                    <p className="online-status">{getOnlineStatus()}</p>
                  </div>
                </div>
                <div className="header-actions">
          <button 
            className={`icon-btn ${showSearch ? 'active' : ''}`} 
            title="Tìm kiếm"
            onClick={handleSearchToggle}
          >
            🔍
          </button>
          <button 
            className={`icon-btn ${showInfo ? 'active' : ''}`} 
            title="Thông tin"
            onClick={handleInfoToggle}
          >
            ℹ️
          </button>
        </div>
      </div>
        {showSearch && (
          <div className="search-bar">
    <input
      type="text"
      value={searchQuery}
      onChange={handleSearch}
      placeholder="Tìm kiếm tin nhắn..."
      className="search-input"
      autoFocus
    />
    {filteredMessages.length > 0 && (
      <div className="search-results">
        <div className="results-header">
          Tìm thấy {filteredMessages.length} tin nhắn
        </div>
        {filteredMessages.map((message) => (
          <MessageItem
            key={message._id}
            message={message}
            isOwn={message.senderId === currentUserId}
            showAvatar={conversation.isGroup}
            highlighted={true}
          />
        ))}
      </div>
    )}
  </div>
)}

{showInfo && (
  <div className="info-panel">
    <div className="info-header">
      <h3>Thông tin {conversation.isGroup ? 'nhóm' : 'người dùng'}</h3>
      <button className="close-btn" onClick={handleInfoToggle}>×</button>
    </div>
    <div className="info-content">
      <div className="info-avatar">
        {conversation.isGroup ? '👥' : (conversation.otherUser?.avatar || '👤')}
      </div>
      <h4>{getConversationName()}</h4>
      {conversation.isGroup ? (
        <>
          <p>{conversation.members?.length || 0} thành viên</p>
          <div className="member-list">
            {conversation.members?.map(member => (
              <div key={member._id} className="member-item">
                <div className="member-avatar">{member.avatar || '👤'}</div>
                <div className="member-info">
                  <span className="member-name">{member.username}</span>
                  <span className={`member-status ${isUserOnline(member._id) ? 'online' : 'offline'}`}>
                    {isUserOnline(member._id) ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="user-status">{getOnlineStatus()}</p>
          <p className="user-email">{conversation.otherUser?.email}</p>
        </>
      )}
    </div>
  </div>
)}


      {/* Messages Area */}
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>Chưa có tin nhắn nào</p>
            <p>Hãy bắt đầu cuộc trò chuyện!</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageItem
              key={message._id}
              message={message}
              isOwn={message.senderId === currentUserId}
              showAvatar={conversation.isGroup}
            />
          ))
        )}
        
        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="typing-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className="typing-text">đang nhập...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
        
      {/* Input Area */}
      <div className="chat-input-container">
        <form onSubmit={handleSubmit} className="chat-input-form">
          <label htmlFor="file-upload" className="file-upload-btn">
            📎
            <input
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </label>

          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            placeholder="Nhập tin nhắn..."
            className="message-input"
          />

          <button 
            type="submit" 
            className="send-btn"
            disabled={!inputMessage.trim()}
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;