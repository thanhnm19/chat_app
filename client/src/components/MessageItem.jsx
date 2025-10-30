import React from 'react';
import { format } from 'date-fns';
import '../styles/MessageItem.css';

const MessageItem = ({ message, isOwn, showAvatar = false }) => {
  const formatTime = (date) => {
    try {
      return format(new Date(date), 'HH:mm');
    } catch {
      return '';
    }
  };

  const getMessageStatusIcon = () => {
    if (!isOwn) return null;
    
    if (message.status === 'sent') {
      return <span className="status-icon">đã gửi</span>;
    } else if (message.status === 'delivered') {
      return <span className="status-icon delivered">đã nhận</span>;
    } else if (message.status === 'read') {
      return <span className="status-icon read">đã xem</span>;
    }
    return null;
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'text':
        return <p className="message-text">{message.content}</p>;
      
      case 'image':
        return (
          <div className="message-image">
            <img src={message.content} alt="Attachment" />
          </div>
        );
      
      case 'file':
        return (
          <div className="message-file">
            <span className="file-icon">📎</span>
            <a href={message.content} download target="_blank" rel="noopener noreferrer">
              {message.fileName || 'Download file'}
            </a>
          </div>
        );
      
      default:
        return <p className="message-text">{message.content}</p>;
    }
  };

  return (
    <div className={`message-item ${isOwn ? 'own' : 'other'}`}>
      {!isOwn && showAvatar && (
        <div className="message-avatar">
          {message.sender?.avatar || '👤'}
        </div>
      )}
      
      <div className="message-content-wrapper">
        {!isOwn && showAvatar && (
          <div className="sender-name">{message.sender?.username}</div>
        )}
        
        <div className="message-bubble">
          {renderMessageContent()}
          
          <div className="message-meta">
            <span className="message-time">{formatTime(message.createdAt)}</span>
            {getMessageStatusIcon()}
          </div>
        </div>
      </div>
      
      {isOwn && showAvatar && <div className="message-avatar-placeholder"></div>}
    </div>
  );
};

export default MessageItem;