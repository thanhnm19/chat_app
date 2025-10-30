// src/context/SocketContext.js
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { createMockSocket } from '../services/mockSocket'; // 🔥 MOCK MODE
import { useAuth } from './AuthContext';
//import websocketService from '../services/websocketService';
const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socketRef = useRef(null);

  // Kết nối Socket khi user đăng nhập
  useEffect(() => {
    if (isAuthenticated && user?.token) {
      // 🔥 MOCK MODE - Dùng mock socket
      const newSocket = createMockSocket();

      socketRef.current = newSocket;
      setSocket(newSocket);

      // Event handlers
      newSocket.on('connect', () => {
        console.log('✅ Socket connected:', newSocket.id);
        setConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
        setConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setConnected(false);
      });

      // Nhận danh sách user online
      newSocket.on('onlineUsers', (users) => {
        console.log('👥 Online users:', users);
        setOnlineUsers(users);
      });

      // Cleanup khi unmount hoặc user logout
      return () => {
        newSocket.close();
        setSocket(null);
        setConnected(false);
      };
    } else {
      // Ngắt kết nối khi logout
      if (socketRef.current) {
        socketRef.current.close();
        setSocket(null);
        setConnected(false);
        setOnlineUsers([]);
      }
    }
  }, [isAuthenticated, user?.token]);

  // ========== EMIT EVENTS ==========

  // Gửi tin nhắn
  const sendMessage = (messageData) => {
    if (socket && connected) {
      socket.emit('sendMessage', messageData);
    }
  };

  // Join conversation room
  const joinConversation = (conversationId) => {
    if (socket && connected) {
      socket.emit('joinConversation', conversationId);
    }
  };

  // Leave conversation room
  const leaveConversation = (conversationId) => {
    if (socket && connected) {
      socket.emit('leaveConversation', conversationId);
    }
  };

  // Gửi typing indicator
  const sendTyping = (conversationId, isTyping) => {
    if (socket && connected) {
      socket.emit('typing', { conversationId, isTyping });
    }
  };

  // Đánh dấu tin nhắn đã xem
  const markAsRead = (conversationId, messageIds) => {
    if (socket && connected) {
      socket.emit('markAsRead', { conversationId, messageIds });
    }
  };

  // Đánh dấu tin nhắn đã nhận
  const markAsReceived = (messageId) => {
    if (socket && connected) {
      socket.emit('messageReceived', { messageId });
    }
  };

  // ========== LISTEN TO EVENTS ==========

  // Subscribe to specific event
  const on = (eventName, callback) => {
    if (socket) {
      socket.on(eventName, callback);
    }
  };

  // Unsubscribe from specific event
  const off = (eventName, callback) => {
    if (socket) {
      socket.off(eventName, callback);
    }
  };

  // Kiểm tra user có online không
  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  const value = {
    socket,
    connected,
    onlineUsers,
    isUserOnline,
    // Emit events
    sendMessage,
    joinConversation,
    leaveConversation,
    sendTyping,
    markAsRead,
    markAsReceived,
    // Listen to events
    on,
    off
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

// Hook để lắng nghe message mới
export const useMessageListener = (callback) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', callback);
      return () => {
        socket.off('newMessage', callback);
      };
    }
  }, [socket, callback]);
};

// Hook để lắng nghe typing
export const useTypingListener = (callback) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('userTyping', callback);
      return () => {
        socket.off('userTyping', callback);
      };
    }
  }, [socket, callback]);
};

// Hook để lắng nghe message status updates
export const useMessageStatusListener = (callback) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('messageStatusUpdate', callback);
      return () => {
        socket.off('messageStatusUpdate', callback);
      };
    }
  }, [socket, callback]);
};