const connect = require('../db');
const formatChatTime = require('../utils/dateFormatter');

class ChatModel { 
    static async getUserChatRooms(userId) {
        const conn = await connect();
        try {
            // 먼저 현재 유저가 참여하고 있는 채팅방 정보를 가져옵니다.
            const chatRoomSql = `
                SELECT cr.*, p.unread_chat_count, p.last_read_chat_id, cr.updated_at
                FROM chatting_room AS cr
                JOIN participant AS p ON cr.id = p.room_id
                WHERE p.user_id = ?;
            `;
            const [chatRooms] = await conn.execute(chatRoomSql, [userId]);

            // 각 채팅방에 대해 다른 참여자들의 정보를 가져옵니다.
            for (let room of chatRooms) {
                const participantSql = `
                    SELECT u.user_id, u.name, u.profile_img_url
                    FROM participant AS p
                    JOIN user AS u ON p.user_id = u.user_id
                    WHERE p.room_id = ?;
                `;
                const [participants] = await conn.execute(participantSql, [room.id]);

                room.participants = participants; // 각 방의 참여자 정보를 추가합니다.
                room.updated_at = formatChatTime(room.updated_at); // 날짜 포맷을 적용합니다.
                console.log("챗룸1",room);
            }
            console.log("챗룸",chatRooms);
            return chatRooms;
        } catch (error) {
            console.error('Error in getUserChatRooms', error);
            throw error;
        } finally {
            await conn.end();
        }
    }
}

module.exports = ChatModel;
