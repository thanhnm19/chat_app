import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket, useMessageListener } from '../context/SocketContext';
// import chatService from '../services/chatService';
import chatService from '../services/mockChatService'; // 🔥 MOCK MODE
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import GroupModal from '../components/GroupModal';
import '../styles/ChatPage.css';

const ChatPage = () => {
  const { user, logout } = useAuth();
  const { connected, joinConversation, leaveConversation } = useSocket();
  
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGroupModal, setShowGroupModal] = useState(false);

  // Load conversations khi component mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Join/Leave conversation rooms khi chọn conversation
  useEffect(() => {
    if (selectedConversation) {
      joinConversation(selectedConversation._id);
      loadMessages(selectedConversation._id);
      
      return () => {
        leaveConversation(selectedConversation._id);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation]);

  // Lắng nghe tin nhắn mới từ socket
  useMessageListener((message) => {
    // Nếu tin nhắn thuộc conversation đang mở, thêm vào messages
    if (selectedConversation && message.conversationId === selectedConversation._id) {
      setMessages(prev => [...prev, message]);
    }
    
    // Cập nhật conversation list (lastMessage, unreadCount...)
    setConversations(prev => 
      prev.map(conv => 
        conv._id === message.conversationId
          ? { 
              ...conv, 
              lastMessage: message,
              unreadCount: conv._id === selectedConversation?._id ? 0 : (conv.unreadCount || 0) + 1
            }
          : conv
      )
    );
  });

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await chatService.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const data = await chatService.getMessages(conversationId);
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    
    // Reset unread count cho conversation này
    setConversations(prev =>
      prev.map(conv =>
        conv._id === conversation._id
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
  };

  const handleSendMessage = async (content, type = 'text') => {
    if (!selectedConversation) return;

    try {
      const message = await chatService.sendMessage(
        selectedConversation._id,
        content,
        type
      );
      
      // Tin nhắn sẽ được thêm vào qua socket listener
      // Nhưng có thể thêm optimistically để UX tốt hơn
      setMessages(prev => [...prev, message]);
      
      // Cập nhật lastMessage trong conversation list
      setConversations(prev =>
        prev.map(conv =>
          conv._id === selectedConversation._id
            ? { ...conv, lastMessage: message }
            : conv
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Không thể gửi tin nhắn');
    }
  };

  const handleCreateConversation = async (userId) => {
    try {
      const conversation = await chatService.createPrivateConversation(userId);
      setConversations(prev => [conversation, ...prev]);
      setSelectedConversation(conversation);
    } catch (error) {
      console.error('Error creating conversation:', error);
      alert('Không thể tạo cuộc trò chuyện');
    }
  };

  const handleCreateGroup = async (groupData) => {
    try {
      const group = await chatService.createGroupConversation(groupData);
      setConversations(prev => [group, ...prev]);
      setSelectedConversation(group);
      setShowGroupModal(false);
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Không thể tạo nhóm');
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="chat-page">
      {/* Header */}
      <div className="chat-header">
        <div className="header-left">
          <h2>💬 Chat App</h2>
          <span className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
            {connected ? 'Online' : 'Offline'}
          </span>
        </div>
        <div className="header-right">
          <span className="user-name">👤 {user?.username}</span>
          <button onClick={handleLogout} className="logout-btn">
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="chat-content">
        <Sidebar
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={handleSelectConversation}
          onCreateConversation={handleCreateConversation}
          onCreateGroup={() => setShowGroupModal(true)}
          loading={loading}
        />

        <ChatWindow
          conversation={selectedConversation}
          messages={messages}
          onSendMessage={handleSendMessage}
          currentUserId={user?._id}
        />
      </div>

      {/* Group Modal */}
      {showGroupModal && (
        <GroupModal
          onClose={() => setShowGroupModal(false)}
          onCreate={handleCreateGroup}
        />
      )}
    </div>
  );
};

export default ChatPage;