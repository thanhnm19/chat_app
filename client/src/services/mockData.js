// src/services/mockData.js
// Dữ liệu giả lập để test frontend

export const mockUsers = [
  {
    _id: '1',
    username: 'Nguyễn Văn A',
    email: 'vana@example.com',
    avatar: '👨',
    online: true
  },
  {
    _id: '2',
    username: 'Trần Thị B',
    email: 'thib@example.com',
    avatar: '👩',
    online: true
  },
  {
    _id: '3',
    username: 'Lê Văn C',
    email: 'vanc@example.com',
    avatar: '👨‍💼',
    online: false
  },
  {
    _id: '4',
    username: 'Phạm Thị D',
    email: 'thid@example.com',
    avatar: '👩‍💻',
    online: true
  },
  {
    _id: '5',
    username: 'Hoàng Văn E',
    email: 'vane@example.com',
    avatar: '🧑',
    online: false
  }
];

export const mockConversations = [
  {
    _id: 'conv1',
    isGroup: false,
    otherUser: mockUsers[1],
    lastMessage: {
      _id: 'msg1',
      content: 'Chào bạn, bạn khỏe không?',
      createdAt: new Date().toISOString(),
      senderId: '2'
    },
    unreadCount: 2,
    members: ['current-user', '2']
  },
  {
    _id: 'conv2',
    isGroup: true,
    name: 'Nhóm Lập Trình Mạng',
    members: ['current-user', '2', '3', '4'],
    lastMessage: {
      _id: 'msg2',
      content: 'Ai làm bài tập chưa?',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      senderId: '3'
    },
    unreadCount: 0
  },
  {
    _id: 'conv3',
    isGroup: false,
    otherUser: mockUsers[3],
    lastMessage: {
      _id: 'msg3',
      content: 'Meeting lúc 3pm nhé',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      senderId: '4'
    },
    unreadCount: 0,
    members: ['current-user', '4']
  }
];

export const mockMessages = {
  'conv1': [
    {
      _id: 'msg1-1',
      conversationId: 'conv1',
      senderId: '2',
      sender: mockUsers[1],
      content: 'Xin chào!',
      type: 'text',
      status: 'read',
      createdAt: new Date(Date.now() - 10000000).toISOString()
    },
    {
      _id: 'msg1-2',
      conversationId: 'conv1',
      senderId: 'current-user',
      content: 'Chào bạn!',
      type: 'text',
      status: 'read',
      createdAt: new Date(Date.now() - 9000000).toISOString()
    },
    {
      _id: 'msg1-3',
      conversationId: 'conv1',
      senderId: '2',
      sender: mockUsers[1],
      content: 'Bạn khỏe không?',
      type: 'text',
      status: 'delivered',
      createdAt: new Date(Date.now() - 5000).toISOString()
    }
  ],
  'conv2': [
    {
      _id: 'msg2-1',
      conversationId: 'conv2',
      senderId: '3',
      sender: mockUsers[2],
      content: 'Hôm nay học về Socket.IO',
      type: 'text',
      status: 'read',
      createdAt: new Date(Date.now() - 7200000).toISOString()
    },
    {
      _id: 'msg2-2',
      conversationId: 'conv2',
      senderId: '4',
      sender: mockUsers[3],
      content: 'Có ai làm bài tập chưa?',
      type: 'text',
      status: 'read',
      createdAt: new Date(Date.now() - 3600000).toISOString()
    }
  ],
  'conv3': [
    {
      _id: 'msg3-1',
      conversationId: 'conv3',
      senderId: '4',
      sender: mockUsers[3],
      content: 'Meeting lúc 3pm nhé',
      type: 'text',
      status: 'read',
      createdAt: new Date(Date.now() - 7200000).toISOString()
    }
  ]
};

// Current user
export const mockCurrentUser = {
  _id: 'current-user',
  username: 'Tôi',
  email: 'me@example.com',
  avatar: '😊',
  token: 'mock-jwt-token-12345'
};