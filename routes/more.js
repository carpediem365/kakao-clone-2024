const express = require('express');
const router = express.Router();
const ChatModel = require('../models/ChatModel');
const User = require('../models/user');

router.get('/', async (req,res) => {
    
    const profileInfo = await User.getProfileInfo(req.session.user.user_id);
    const {totalUnread} = await ChatModel.getUserChatRooms(req.session.user.user_id);
    res.render('more', {profileInfo,totalUnread})
})

module.exports = router;