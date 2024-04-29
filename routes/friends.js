const express = require('express');
const ChatModel = require('../models/ChatModel');
const User = require('../models/user');
const multer = require('multer');
const path = require('path');
const config = require('../config/config');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function(req,file,cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function(req,file,cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

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
    const {totalUnread} = await ChatModel.getUserChatRooms(loggedInUser.user_id);
    console.log("profileInfo: ", profileInfo)
    console.log("친구정보입니다.",friendsList);
    res.render('friends', {
      profile: profileInfo, // 프로필 정보
      friends: friendsList, // 친구 목록 전달
      totalUnread : totalUnread
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

// 프로필 수정 모달창 보여주는 라우터
router.get('/:id' , async (req,res) => {
  const userId = req.params.id;
  let responseData;
  if(userId === req.session.user.user_id){
    responseData = await User.getProfileInfo(userId);
  }else{
    console.log("/id 요청",userId,req.session.user.user_id)
    const [profileInfo, friendInfo]  = await User.getFriendProfileInfo(userId,req.session.user.user_id);
    console.log("/id 요청friend",friendInfo)
    console.log("/id 요청friend",profileInfo)
    responseData = {
      profileInfo, // 친구의 프로필 정보
      friendName: friendInfo.friend_name // 친구 목록에서의 이름
    };
  }
  res.json(responseData);
})

// 프로필 업데이트 라우트
router.post('/update-profile/:userId',async (req,res) => {
  const userId = req.params.userId;
  const updateData = req.body;
  
  try{
    console.log("프로필업데이트중req",req.session.user);
    console.log("프로필업데이트중req",req.session.user.user_id);
    let result;
    if(userId === req.session.user.user_id){
      // 로그인한 사용자의 프로필 업데이트
      result = await User.updateProfile(userId,updateData)
    } else {
      // 친구 프로필 업데이트
      result = await User.updateFriendName(req.session.user.user_id, userId,updateData.name);
    }
    if (result) {
      res.json({ success: true , message: 'Profile updated successfully', userId:req.session.user.user_id });
    } else {
      res.status(400).json({ success: false, message: 'Profile update failed'});
    }
  } catch (error) {
    console.log('Error updating profile:', error);
    res.status(500).json({ success: false, message: error.message});
  }
})

// 프로필 이미지 업로드 라우트
router.post('/upload-profile-image', upload.single('profileImage'), async (req, res) => {
  if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const baseUrl = config.BASE_URL;
  // 파일 경로 업데이트 로직
  const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
  try {
      await User.updateProfile(req.session.user.user_id, { profile_img_url: imageUrl });
      res.json({ success: true, imageUrl });
  } catch (error) {
      console.error('Error uploading profile image:', error);
      res.status(500).json({ success: false, message: 'Error uploading image' });
  }
});

// 배경 이미지 업로드 라우트
router.post('/upload-background-image', upload.single('backgroundImage'), async (req, res) => {
  console.log("imageUrl1",req)
  if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const baseUrl = config.BASE_URL;
  // 파일 경로 업데이트 로직
  const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
  console.log("imageUrl",imageUrl)
  try {
      await User.updateProfile(req.session.user.user_id, { background_img_url: imageUrl });
      res.json({ success: true, imageUrl });
  } catch (error) {
      console.error('Error uploading background image:', error);
      res.status(500).json({ success: false, message: 'Error uploading image' });
  }
});

router.post('/update-default-image',async(req,res) =>{
  const userId = req.session.user ? req.session.user.user_id : null;
  const { imagePath, imageType } = req.body;

  if(!userId){
    return res.status(401).send('로그인이 필요합니다.');
  }

  try{
    const result = await User.updateDefaultImage(userId, imagePath, imageType);
    if(result){
      res.json({success: true, message : "Default image updated successfully"})
    } else{
      res.status(400).json({success: false, message:"Failed to update default image"});
    }
  } catch (error) {
      console.error('Error in update-default-image route:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

  module.exports = router;