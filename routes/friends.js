const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.get('/', async (req, res) => {
    if (!req.session.user) {
      return res.redirect('/login'); // 사용자가 로그인하지 않았다면 로그인 페이지로 리다이렉트
    }
    const loggedInUser = req.session.user;
    console.log("logged in user: ", loggedInUser);
    try {
    // 친구 목록 및 프로필 정보 조회
    const friendsList = await User.getFriendsList(loggedInUser.user_id);
    const profileInfo = await User.getProfileInfo(loggedInUser.user_id);
    console.log("profileInfo: ", profileInfo)
    console.log("친구정보입니다.",friendsList);
    res.render('friends', {
      user: profileInfo,
      profile: profileInfo, // 프로필 정보
      friends: friendsList // 친구 목록 전달
    });
  } catch (error) {
    console.error('Error in friends route:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/check-user/:friendId', async (req, res) => {
  const friendId = req.params.friendId;
  const userId = req.session.user ? req.session.user.user_id : null;

  if (!userId) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
  }

    try {
        const checkResult = await User.checkUserAndFriendship(userId, friendId);
        console.log("checkResult값:",checkResult)
        res.json(checkResult);
    } catch (error) {
        console.error("여기인가3",error);
        res.status(500).json({ success: false, message: error.message });
    }
});


router.post('/add-friend', async (req, res) => {
  const userId = req.session.user ? req.session.user.user_id : null;
  const friendId = req.body.friendId;
  console.log("친구요청 데이터",req.body);

  if (!userId) {
      return res.status(401).send('로그인이 필요합니다.');
  }

  try {
      const result = await User.addFriend(userId, friendId);
      console.log("result1",result);
      if (result) {
        res.json({ success: true});
      } else {
        console.log("실패result",result);
        res.status(400).json({ success: false, message: '친구 추가에 실패했습니다.' });
        
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
  }
});

  module.exports = router;