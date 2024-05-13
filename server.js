const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const http = require('http');
const socketIo = require('socket.io');
const ChatModel = require('./models/ChatModel');
require('dotenv').config();

const signupRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');
const friendsRoutes = require('./routes/friends');
const chatsRoutes = require('./routes/chats');
const chatRoutes = require('./routes/chat');
const findRoutes = require('./routes/find');
const moreRoutes = require('./routes/more');
const settingsRoutes = require('./routes/settings');
const server = http.createServer(app);
const io = socketIo(server);

// 뷰 엔진 설정
app.set('view engine', 'ejs');
app.set('views', 'views');

// 미들웨어 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// 세션 설정
app.use(session({
  secret: process.env.SESSION_SECRET, // 비밀키 설정
  resave: false,
  saveUninitialized: true,
}));

app.set('io', io);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinRoom', (data) => {
    try {
      socket.join(data.currentRoomId);
      console.log(`User joined room with ID: ${data.currentRoomId} and User ID: ${data.currentUserId}`);
      console.log(`Room ${data.currentRoomId} now has ${Array.from(io.sockets.adapter.rooms.get(data.currentRoomId) || []).length} clients`);
  } catch (error) {
      console.error('Error joinRoom:', error);
  }
  });

  socket.on('setup', (data) => {
    try{
      socket.join(data.currentUserId);
      console.log(`User ID: ${data.currentUserId}`)
    }catch(error) {
      console.error('Error setup:', error);
    }
    
  })

  // 메시지 전송처리
  socket.on('chatMessage', (data) => {
    console.log("chatMessage",JSON.stringify(data));
    io.to(data.currentRoomId).emit('message', {roomId: data.currentRoomId, userId: data.userId, message: data.message, messageId: data.messageId, time:new Date(), profileImgUrl: data.profileImgUrl ,senderName:data.senderName, unreadCount: data.unreadCount });
    io.emit('updateChatsRoom', {roomId: data.currentRoomId, userId: data.userId, receiverId: data.receiverId, lastMessage: data.message, updatedAt:new Date(), profileImgUrl: data.profileImgUrl, friend_profileImgUrl: data.friend_profileImgUrl, senderName:data.senderName, unread_chat_count: data.unread_chat_count});
  });

  // 메시지 읽음 처리
  socket.on('messageReadCount', async ({ messageId, roomId, currentUserId }) => {
    console.log("읽음처리 실행 server.js messageReadCounts",messageId,roomId, currentUserId)
    try {
        await ChatModel.markMessagesAsRead(currentUserId, roomId, messageId);
        const result = await ChatModel.messageReadCount(currentUserId, roomId, messageId);
        const totalUnreadCount = await ChatModel.calculateUnreadMessages(currentUserId);
        const unread_Count = result.unreadCount
        if (result.affectedRows > 0) {
          try{
            console.log(`Emitting to ${Array.from(io.sockets.adapter.rooms.get(roomId) || []).length} clients in room ${roomId}.`);
            io.to(roomId).emit('messageRead', { messageId, currentUserId , unread_Count});
            io.emit('chatRoomRead', {roomId, unread_Count, totalUnreadCount})
          }catch(e){
            console.error("Error updating read status:", error);
          }
            
        }
    } catch (error) {
        console.error("Error updating read status:", error);
    }
});

socket.on('requestUnreadUpdate', data => {
  io.to(data.receiverId).emit('updateTotalUnread', data.totalUnreadCount);
});

socket.on('searchFriends', async (data) => {
  try {
      const friendsInfo = await ChatModel.searchFriends(data.userId, data.searchTerm);
      socket.emit('updateFriendsList', friendsInfo);
  } catch (error) {
      console.error('Search friends error:', error);
  }
});

socket.on('searchChats', async (data) => {
  console.log("searchChats신호", data);
  try{
    const rooms = await ChatModel.searchChats(data.userId, data.filter);
    console.log("searchChats신호1", rooms);
    socket.emit('filteredChats', rooms);
  } catch (error) {
    console.error('Error searching chats:', error);
}
});




socket.on('disconnect', () => {
  console.log('Client disconnected');
});
});



app.get('/', (req, res) => {
  res.render('login'); 
  });
  

// 라우트
app.use('/signup', signupRoutes);
app.use('/login',loginRoutes);
app.use('/friends', friendsRoutes);
app.use('/chats',chatsRoutes);
app.use('/chat', chatRoutes);
app.use('/find',findRoutes);
app.use('/more',moreRoutes);
app.use('/settings',settingsRoutes);

// 서버 시작
const port = 3000;
server.listen(port, '192.168.0.16', () => {
  console.log(`Server is running on port ${port}`);
});
