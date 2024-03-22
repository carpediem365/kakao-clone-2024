const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.get('/', (req, res) => {
    if (!req.session.user) {
      return res.redirect('/login'); // 사용자가 로그인하지 않았다면 로그인 페이지로 리다이렉트
    }
  
    const loggedInUser = req.session.user;
    // 친구 목록 가져오기 (가상의 함수, 실제 구현 필요)
    // const friendsList = await getFriendsList(loggedInUser.ID);
  
    res.render('friends', {
      user: loggedInUser,
      friends: friendsList // 친구 목록 전달
    });
  });

  module.exports = router;