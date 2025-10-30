// src/services/mockSocket.js
// Mock Socket.IO để test frontend

import { mockUsers } from './mockData';

class MockSocket {
  constructor() {
    this.id = 'mock-socket-' + Math.random();
    this.connected = false;
    this.listeners = {};
    this.rooms = new Set();
    
    // Auto connect after 500ms
    setTimeout(() => {
      this.connected = true;
      this.emit('connect');
      
      // Send initial online users
      const onlineUserIds = mockUsers
        .filter(u => u.online)
        .map(u => u._id);
      this.emit('onlineUsers', onlineUserIds);
    }, 500);
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    if (!this.listeners[event]) return;
    
    if (callback) {
      this.listeners[event] = this.listeners[event].filter(
        cb => cb !== callback
      );
    } else {
      delete this.listeners[event];
    }
  }

  emit(event, data) {
    console.log('🔵 Mock Socket EMIT:', event, data);
    
    // Handle internal events
    if (event === 'connect' || event === 'disconnect') {
      if (this.listeners[event]) {
        this.listeners[event].forEach(cb => cb());
      }
      return;
    }
    
    // Emit to listeners
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
    
    // Simulate server responses
    this.simulateServerResponse(event, data);
  }

  simulateServerResponse(event, data) {
    switch (event) {
      case 'sendMessage':
        // Simulate receiving the message back
        setTimeout(() => {
          this.emit('newMessage', {
            ...data,
            _id: 'msg-' + Date.now(),
            createdAt: new Date().toISOString(),
            status: 'sent'
          });
        }, 100);
        break;

      case 'typing':
        // Simulate other user typing
        if (Math.random() > 0.7) { // 30% chance
          setTimeout(() => {
            const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
            this.emit('userTyping', {
              userId: randomUser._id,
              conversationId: data.conversationId,
              isTyping: true
            });
            
            // Stop typing after 2s
            setTimeout(() => {
              this.emit('userTyping', {
                userId: randomUser._id,
                conversationId: data.conversationId,
                isTyping: false
              });
            }, 2000);
          }, 500);
        }
        break;

      case 'markAsRead':
        // Simulate status update
        setTimeout(() => {
          data.messageIds.forEach(msgId => {
            this.emit('messageStatusUpdate', {
              messageId: msgId,
              status: 'read'
            });
          });
        }, 200);
        break;

      case 'joinConversation':
        this.rooms.add(data);
        console.log('✅ Joined conversation:', data);
        break;

      case 'leaveConversation':
        this.rooms.delete(data);
        console.log('👋 Left conversation:', data);
        break;
    }
  }

  close() {
    this.connected = false;
    this.emit('disconnect');
    this.listeners = {};
    this.rooms.clear();
  }

  // Simulate random events for testing
  simulateRandomEvents() {
    // Random user comes online
    setInterval(() => {
      if (Math.random() > 0.8) {
        const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
        const onlineUserIds = mockUsers
          .filter(u => u.online)
          .map(u => u._id);
        
        if (!onlineUserIds.includes(randomUser._id)) {
          onlineUserIds.push(randomUser._id);
        }
        
        this.emit('onlineUsers', onlineUserIds);
      }
    }, 10000); // Every 10s
  }
}

// Factory function
export const createMockSocket = () => {
  const socket = new MockSocket();
  
  // Enable random events for more realistic testing
  if (process.env.NODE_ENV === 'development') {
    socket.simulateRandomEvents();
  }
  
  return socket;
};