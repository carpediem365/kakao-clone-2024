const express = require('express');
const router = express.Router();
const ChatModel = require('../models/ChatModel');
const User = require('../models/user');

router.get('/:roomId', async(req,res)=>{
    try{
        const roomId = req.params.roomId;
        const userId = req.session.user.user_id;
        const chatRoomInfo = await ChatModel.getChatRoomInfo(roomId,userId);
        const chatMessages = await ChatModel.getChatMessages(roomId,userId);
        const participants = await ChatModel.getRoomParticipants(userId,roomId);
        const lastMessageId = await ChatModel.getLatestMessageId(roomId);
        let result = null;
        // 읽음 처리 실행
        if (lastMessageId.id) {
            await ChatModel.markMessagesAsRead(userId, roomId, lastMessageId.id);
            result = await ChatModel.messageReadCount(userId, roomId, lastMessageId.id)
            console.log("읽음처리 실행 chat.js messageReadCounts")
            req.app.get('io').in(roomId).emit('messageRead', {
                messageId: lastMessageId.id,
                currentUserId: userId,
                unread_Count: result.unreadCount
            });
            
        }
        console.log("최근 메시지 ID:", lastMessageId.id);
        console.log("신호1",chatRoomInfo)
        console.log("신호1",chatRoomInfo.room)
        // console.log("신호2",chatMessages)
        console.log("unreadCount임",chatMessages.unreadCount)
        console.log("participants",participants)
        res.render('chat', { 
            roomId : roomId,
            userId : userId,
            chatRoomInfos : chatRoomInfo,
            roomName: chatRoomInfo[0].room_name, 
            messages: chatMessages,
            currentUserId: req.session.user.user_id,
            participants: participants,
            unreadCount : result.unreadCount,
            messageId : lastMessageId.id
        });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
})

router.post('/send-message/:roomId', async (req,res)=> {
    console.log("chat.js에 send-mesasge까지는 신호옴")
    const roomId = req.params.roomId;
    const userId = req.session.user.user_id;
    const { message } = req.body;
    try{
        const LatestMessageId = await ChatModel.saveChatMessage(roomId, userId, message);
        const participants = await ChatModel.getRoomParticipants(userId,roomId);
        const lastMessageId = await ChatModel.getLatestMessageId(roomId);
        console.log("chat.js lastMessageId",lastMessageId)
        console.log("chat.js lastMessageId",lastMessageId.id)
        console.log("chat,js participants:", participants);
        // 현재 사용자 정보 찾기
        const specificUserInfo = participants.find(participant => participant.user_id === userId);

         // 친구(다른 참가자) 정보 찾기
         const friendInfo = participants.find(participant => participant.user_id !== userId);
         if (friendInfo) {
            // 친구가 설정한 이름 가져오기
            const senderName = await ChatModel.getFriendNameByUserId(userId, friendInfo.user_id);
            console.log("Friend's name for user:", senderName);
            console.log("chat,js specificUserInfo:", specificUserInfo);
        // 필요한 정보 조합
        const combinedInfo = {
            roomId: roomId,
            userId: specificUserInfo.user_id,
            name: specificUserInfo.name,
            profileImgUrl: specificUserInfo.profile_img_url,
            senderName: senderName[0].senderName || specificUserInfo.name,
            message : message,
            messageId : lastMessageId.id,
            unreadCount : lastMessageId.unread_count,
            unread_chat_count : friendInfo.unread_chat_count
        };
        console.log("chat.js 필요한정보조합:",combinedInfo)
   
        // req.app.get('io').in(roomId).emit('chatMessage', combinedInfo); 이건 왜 안됐을까?
        res.status(200).json({
            message: "Message sent successfully",
            data: combinedInfo  // 클라이언트에 전송할 데이터
        });

        // // 읽음 처리 실행
        // if (lastMessageId) {
        //     const updatedRows = await ChatModel.messageReadCount(userId, roomId, lastMessageId.id);
        //     console.log("읽음처리 실행2",updatedRows)
        //     if(updatedRows > 0){
        //         console.log("읽음처리 실행")
        //         req.app.get('io').in(roomId).emit('messageRead', { userId, roomId });
        //     }
          
        // }
    }else{
        throw new Error("Friend not found in this room");
    }
    } catch (error) {
        console.error("Failed to send message:", error);
        res.status(500).send("Failed to send message1");
    }
})

module.exports = router;

