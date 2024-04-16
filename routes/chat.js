const express = require('express');
const router = express.Router();
const ChatModel = require('../models/ChatModel');
const User = require('../models/user');

router.get('/:roomId', async(req,res)=>{
    try{
        console.log("신호")
        const roomId = req.params.roomId;
        const userId = req.session.user.user_id;
        const chatRoomInfo = await ChatModel.getChatRoomInfo(roomId,userId);
        const chatMessages = await ChatModel.getChatMessages(roomId,userId);
        const participants = await ChatModel.getRoomParticipants(userId,roomId);
        console.log("신호1",chatRoomInfo)
        console.log("신호1",chatRoomInfo.room)
        console.log("신호2",chatMessages)
        res.render('chat', { 
            roomId : roomId,
            userId : userId,
            roomName: chatRoomInfo, 
            messages: chatMessages,
            currentUserId: req.session.user.user_id,
            participants: participants
        });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
})

module.exports = router;

