const express = require('express');
const router = express.Router();
const ChatModel = require('../models/ChatModel');

router.get('/', async (req,res) => {
    const {totalUnread} = await ChatModel.getUserChatRooms(req.session.user.user_id);
    res.render('find',{totalUnread});
})

module.exports = router;