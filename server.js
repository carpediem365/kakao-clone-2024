const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const http = require('http');
const socketIo = require('socket.io');

const signupRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');
const friendsRoutes = require('./routes/friends');
const chatsRoutes = require('./routes/chats');
const chatRoutes = require('./routes/chat');
// 뷰 엔진 설정
app.set('view engine', 'ejs');
app.set('views', 'views');

// 미들웨어 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// 세션 설정
app.use(session({
  secret: '4321', // 비밀키 설정
  resave: false,
  saveUninitialized: true,
}));

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinRoom', (data) => {
    console.log(`User joined room with ID: ${data.roomId} and User ID: ${data.userId}`);
    socket.join(data.roomId);
  });

  socket.on('chatMessage', (data) => {
    console.log("chatMessage",JSON.stringify(data));
    io.to(data.roomId).emit('message', {userId: data.userId, message: data.message, time:new Date(), profileImgUrl: data.profileImgUrl ,senderName:data.senderName });
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

// 서버 시작
const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
