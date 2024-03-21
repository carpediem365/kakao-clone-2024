const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('signup');
  console.log("get")
});

router.post('/', async (req, res) => {
    console.log("post")
  const { email, password, phonenumber, username } = req.body;
  console.log(req.body)
  const user = new User(email, password, phonenumber, username);

  try {
    await user.save();
    res.redirect('/');
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// 이메일 중복 확인 라우트
router.post('/check-email', async (req, res) => {
  const { email } = req.body;
  console.log(req.body)
  console.log('체크 Received email check for:', email); // 로그 추가

  try {
    const emailExists = await User.emailExists(email);
    if (emailExists) {
      res.json({ message: '이미 사용중인 아이디입니다.' });
    } else {
      res.json({ message: '사용 가능한 아이디입니다.' });
    }
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;