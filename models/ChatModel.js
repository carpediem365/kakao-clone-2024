const connect = require('../db');

class ChatModel { 
    static async getUserChatRooms(userId) {
        const conn = await connect();
        try{
            const sql = `select r.*, p.last_read_chat_id , p.updated_at,  p.unread_chat_count
            from chatting_room AS r
            join participant As p ON r.id = p.room_id
            where p.user_id = ?;
            `;
            const [rooms] = await conn.execute(sql, [userId]);
            return rooms;
        } catch (error) {
            console.error('Error in getUserChatRooms', error);
            throw error;
        }finally{
            await conn.end();
        }
    }
}

module.exports = ChatModel;