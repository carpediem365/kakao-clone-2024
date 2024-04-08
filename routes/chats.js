const express = require('express');
const router = express.Router();
const ChatModel = require('../models/ChatModel');

// 채팅 목록 페이지 라우트
router.get('/', async (req, res) => {
    try {
        const userId = req.session.user.user_id;
        const chatRooms = await ChatModel.getUserChatRooms(userId);
        console.log("chatjs: ", userId);
        console.log("chatRooms: ", chatRooms);
        res.render('chats', {chatRooms: chatRooms});
        // 채팅 데이터를 불러오는 로직 구현
        // 예: const chats = await ChatModel.getChats();
        // res.render('chatPage', { chats: chats });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;