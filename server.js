const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const signupRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');
const friendsRoutes = require('./routes/friends');

// 뷰 엔진 설정
app.set('view engine', 'ejs');
app.set('views', 'views');

// 미들웨어 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 세션 설정
app.use(session({
  secret: '4321', // 비밀키 설정
  resave: false,
  saveUninitialized: true,
}));




app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/login.html'));
  });
  

// 라우트
app.use('/signup', signupRoutes);
app.use('/login',loginRoutes);
app.use('/friends', friendsRoutes);

// 서버 시작
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
