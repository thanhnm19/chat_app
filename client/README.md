# 💬 Chat App - Client (React)

Ứng dụng Chat đa client được xây dựng với React, Socket.IO và modern web technologies.

## 🚀 Tính năng

- ✔️ Đăng nhập / Đăng ký
- ✔️ Chat 1-1 với người dùng khác
- ✔️ Chat nhóm (tạo và quản lý)
- ✔️ Hiển thị trạng thái online/offline realtime
- ✔️ Hiển thị trạng thái đã nhận/đã xem tin nhắn
- ✔️ Lưu lịch sử chat

## 📁 Cấu trúc thư mục

```
src/
├── components/          # Các React components
│   ├── ChatWindow.jsx   # Cửa sổ chat chính
│   ├── GroupModal.jsx   # Modal tạo nhóm
│   ├── MessageItem.jsx  # Component tin nhắn đơn
│   ├── Sidebar.jsx      # Sidebar danh sách conversation
│   └── ProtectedRoute.jsx
├── context/            # React Context (State management)
│   ├── AuthContext.js   # Quản lý authentication
│   └── SocketContext.js # Quản lý WebSocket
├── services/           # API services
│   ├── authService.js   # Auth API calls
│   └── chatService.js   # Chat API calls
├── pages/              # Pages/Routes
│   ├── ChatPage.jsx     # Trang chat chính
│   └── LoginPage.jsx    # Trang đăng nhập
├── App.js              # Root component
└── index.js            # Entry point
```

 🛠️ Cài đặt

 # 1. Clone repository
```
git clone ...
cd chat-client
```

# 2. Cài đặt dependencies
```
npm install
```

# 3. Cấu hình môi trường
Tạo file `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

# 4. Chạy ứng dụng
```
npm start
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

## 🔌 Kết nối với Backend

### API Endpoints cần thiết

#### Authentication
```
POST /api/auth/register    - Đăng ký user mới
POST /api/auth/login       - Đăng nhập
GET  /api/auth/users       - Lấy danh sách users
PUT  /api/auth/user/:id    - Cập nhật thông tin user
```

#### Conversations
```
GET  /api/conversations                  - Lấy tất cả conversations
POST /api/conversations/private          - Tạo conversation 1-1
POST /api/conversations/group            - Tạo nhóm
PUT  /api/conversations/:id              - Cập nhật thông tin nhóm
POST /api/conversations/:id/members      - Thêm thành viên vào nhóm
DEL  /api/conversations/:id/leave        - Rời khỏi nhóm
```

#### Messages
```
GET  /api/messages/:conversationId       - Lấy tin nhắn của conversation
POST /api/messages                       - Gửi tin nhắn
PUT  /api/messages/read                  - Đánh dấu đã đọc
POST /api/messages/upload                - Upload file/ảnh
GET  /api/messages/search                - Tìm kiếm tin nhắn
```

### Socket.IO Events

#### Client emit (gửi lên server)
```javascript
socket.emit('joinConversation', conversationId)
socket.emit('leaveConversation', conversationId)
socket.emit('sendMessage', messageData)
socket.emit('typing', { conversationId, isTyping })
socket.emit('markAsRead', { conversationId, messageIds })
socket.emit('messageReceived', { messageId })
```

#### Client listen (nhận từ server)
```javascript
socket.on('newMessage', (message) => {})
socket.on('onlineUsers', (userIds) => {})
socket.on('userTyping', ({ userId, conversationId, isTyping }) => {})
socket.on('messageStatusUpdate', ({ messageId, status }) => {})
```

## 📦 Dependencies chính

- **react** ^18.2.0 - UI Framework
- **react-router-dom** ^6.20.0 - Routing
- **socket.io-client** ^4.5.4 - WebSocket client
- **axios** ^1.6.2 - HTTP client
- **date-fns** ^2.30.0 - Date formatting
- **react-icons** ^4.12.0 - Icons

## 🎨 Customization

### Thay đổi theme colors
Chỉnh sửa các file CSS:
- Primary gradient: `#667eea` -> `#764ba2`
- Background: `#f0f2f5`
- Text primary: `#333`

### Thêm features mới
1. Tạo component trong `src/components/`
2. Thêm API call vào `src/services/`
3. Integrate vào page tương ứng

## 🐛 Troubleshooting

### Socket không kết nối
- Kiểm tra `REACT_APP_SOCKET_URL` trong `.env`
- Đảm bảo backend đang chạy
- Check CORS configuration ở backend

### Không load được conversations
- Kiểm tra `REACT_APP_API_URL` trong `.env`
- Kiểm tra token trong localStorage
- Verify API endpoints ở backend

## 📝 Todo List cho Backend

Khi code backend, cần implement:

### Database Models
```javascript
// User Model
{
  _id, username, email, password (hashed),
  avatar, createdAt, updatedAt
}

// Conversation Model
{
  _id, name, isGroup, members: [userId],
  createdBy, createdAt, updatedAt
}

// Message Model
{
  _id, conversationId, senderId,
  content, type, status,
  readBy: [userId], createdAt
}
```

### Authentication
- JWT token-based authentication
- Password hashing với bcrypt
- Token refresh mechanism

### Socket.IO Setup
- Authenticate socket connections
- Room management (join/leave conversation)
- Broadcast messages to room members
- Track online users

### File Upload
- Multer cho file handling
- Cloud storage (AWS S3, Cloudinary...)
- File size và type validation

