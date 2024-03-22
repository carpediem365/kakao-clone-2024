const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('signup', { prevInput: {}, errorMessage: null ,isError: true, });
  console.log("get")
});

router.post('/', async (req, res) => {
  const { userId, password, phoneNumber, userName } = req.body;

  try {
    const userIdExists = await User.userIdExists(userId);
    if (userIdExists) {
      // 이메일이 중복된 경우, 회원가입 페이지로 리다이렉트하며 오류 메시지 및 입력값 전달
      return res.render('signup', {
        errorMessage: '이미 사용중인 아이디입니다.', // 오류 메시지
        isError: true, 
        prevInput: { userId, password, phoneNumber, userName } // 이전 입력값
      });
    }

    const user = new User(userId, password, phoneNumber, userName);
    await user.save();
    res.redirect('/');
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// 이메일 중복 확인 라우트
router.post('/check-userId', async (req, res) => {
  const { userId } = req.body;
  console.log(req.body)
  console.log('체크 Received userId check for:', userId); // 로그 추가

  try {
    const userIdExists = await User.userIdExists(userId);
    if (userIdExists) {
      res.json({ message: '이미 사용중인 아이디입니다.' });
    } else {
      res.json({ message: '사용 가능한 아이디입니다.' });
    }
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;