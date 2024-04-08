const connect = require('../db');
const formatChatTime = require('../utils/dateFormatter');

class ChatModel { 
    static async getUserChatRooms(userId) {
        const conn = await connect();
        try{
            const sql = `SELECT 
            cr.*, 
            p.unread_chat_count, 
            p.last_read_chat_id,
            cr.updated_at,
            u.user_id AS participant_user_id, 
            u.name AS participant_name, 
            u.profile_img_url AS participant_profile_img
        FROM 
            participant AS p
        JOIN 
            chatting_room AS cr ON p.room_id = cr.id
        JOIN 
            participant AS p2 ON cr.id = p2.room_id
        JOIN 
            user AS u ON p2.user_id = u.user_id
        WHERE 
            p.user_id = ? AND p2.user_id != ?;`;
            const [rooms] = await conn.execute(sql, [userId]);
            return rooms.map(room => ({
                ...room,
                updated_at: formatChatTime(room.updated_at)
            }));
        } catch (error) {
            console.error('Error in getUserChatRooms', error);
            throw error;
        }finally{
            await conn.end();
        }
    }
}

module.exports = ChatModel;