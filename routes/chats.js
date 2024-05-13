const express = require('express');
const router = express.Router();
const ChatModel = require('../models/ChatModel');
const User = require('../models/user');
// 채팅 목록 페이지 라우트
router.get('/', async (req, res) => {
    try {
        const userId = req.session.user.user_id;
        const friends = await User.getFriendsList(userId);
        const {chatRooms,totalUnread} = await ChatModel.getUserChatRooms(userId);
        console.log("chatjs: ", userId);
        console.log("chatRooms: ", chatRooms);
        // console.log("chatRooms2: ", chatRooms[0].participants);
        // console.log("chatRooms3: ", chatRooms[0].participants[0]);
        console.log("친구정보: ", friends);
        res.render('chats', {userId, chatRooms: chatRooms, currentUserId : userId, friends:friends, totalUnread:totalUnread});
        // 채팅 데이터를 불러오는 로직 구현
        // 예: const chats = await ChatModel.getChats();
        // res.render('chatPage', { chats: chats });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/create-chat', async (req, res) => {
    const { friendId } = req.body;
    try {
        const newChatRoomId = await ChatModel.createChatRoom(req.session.user.user_id, friendId);
        res.json({ id: newChatRoomId });
      } catch (error) {
        console.error('채팅방 생성 에러', error);
        res.status(500).send('채팅방 생성 중 에러가 발생했습니다.');
      }
    });

    router.get('/search', async (req, res) => {
        const userId = req.session.user.user_id;
        const query = req.query.query || '';  // URL에서 검색 쿼리를 가져옵니다.
        console.log("친구정보입니다.query:",query);
        if (!query) {
            return res.json({ friends: [] });
        }
    
        try {
            let friends;
            if (query === 'ALL_FRIENDS') {
                // 검색어가 비어있으면 현재 사용자의 모든 친구 목록을 반환
                friends = await User.getFriendsList(userId);
                console.log("친구정보입니다.query1",friends);
            } else {
                // 검색어가 있으면 해당 검색어로 친구를 필터링
                friends = await ChatModel.searchFriends(userId, query);
            }
            console.log("친구정보입니다.",friends);
            res.json( friends );
        } catch (error) {
            console.error('Error retrieving friends:', error);
            res.status(500).send('Internal Server Error');
        }
    });
module.exports = router;