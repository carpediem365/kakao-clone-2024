const express = require('express');
const bodyParser = require('body-parser');
const signupRoutes = require('./routes/signup');
const path = require('path');
const app = express();

// 뷰 엔진 설정
app.set('view engine', 'ejs');
app.set('views', 'views');

// 미들웨어 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/login.html'));
  });
  

// 라우트
app.use('/signup', signupRoutes);

// 서버 시작
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
