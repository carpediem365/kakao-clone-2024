const connect = require('../db');
const formatChatTime = require('../utils/dateFormatter');

class ChatModel { 
    static async getUserChatRooms(userId) {
        const conn = await connect();
        try {
            // 먼저 현재 유저가 참여하고 있는 채팅방 정보를 가져옵니다.
            const chatRoomSql = `
                SELECT cr.*, p.unread_chat_count, p.last_read_chat_id, cr.updated_at, p.room_name
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

    static async createChatRoom(userId, friendId){
        const conn = await connect();
        try{
            await conn.beginTransaction();

            // 친구 이름 조회
            const [friendRows] = await conn.query(
                `SELECT name FROM user WHERE user_id = ?`, 
                [friendId]
            );
            const friendName = friendRows[0].name;
            console.log("친구이름모달",friendRows[0])

            const [myRows] = await conn.query(
                `SELECT name FROM user WHERE user_id = ?`, 
                [userId]
            );
            const myName = myRows[0].name;

            // 고유한 채팅방 식별자
            const identifier = `${userId}_${friendId}`;

                // 중복 채팅방 확인
            const [existingRoom] = await conn.query(
                `SELECT id FROM chatting_room WHERE identifier = ?`,
                [identifier]
            );
            if (existingRoom.length > 0) {
                await conn.commit();
                return existingRoom[0].id; // 이미 존재하는 채팅방 ID 반환
            }
    
            const chatRoomResult = await conn.query(
                 `INSERT INTO chatting_room (identifier, type) VALUES (?, 'private')`, 
                [identifier]
            );
            const newChatRoomId = chatRoomResult[0].insertId
            console.log("친구이름모달",chatRoomResult[0])
            // 채팅방 참가자 추가
            await conn.query(
                `INSERT INTO participant (user_id, room_id,room_name) VALUES (?, ?, ?)`,
                [userId, newChatRoomId,friendName]
              );

                    // 채팅방 참가자 추가 - 친구
            await conn.query(
                `INSERT INTO participant (user_id, room_id, room_name) VALUES (?, ?, ?)`,
                [friendId, newChatRoomId, myName]
            );

            await conn.commit();
            return newChatRoomId;
        }catch(error){
            await conn.rollback();
            console.error('Error in createChatRoom', error);
            throw error;
        } finally{
            await conn.end();
        }


    }

    //채팅방 정보 조회
    static async getChatRoomInfo(roomId,userId){
        const conn = await connect();
        try{
            const sql = `SELECT p.room_name 
            FROM participant AS p 
            JOIN chatting_room AS cr ON p.room_id = cr.id 
            WHERE p.room_id = ? AND p.user_id = ?;`;
            const [rooms] = await conn.execute(sql, [roomId,userId]);
            conn.end();
            console.log("chatmodel1", rooms)
        if(rooms.length >0) {
            return rooms[0].room_name;
        }else{
            throw new Error('채팅방을 찾을 수 없습니다.')
        }
    } catch(error) {
        console.error('Error in getChatRoomInfo', error);
        throw error;
    }
}
    
    // 채팅 메시지 조회
    static async getChatMessages(roomId,userId){
        const conn = await connect();
        try{
            const sql = `SELECT c.*, u.name AS sender_name 
            FROM chatting AS c
            JOIN user AS u ON c.sender_id = u.user_id 
            WHERE c.room_id = ?
            ORDER BY c.created_at ASC
        `;
            const [messages] = await conn.execute(sql, [roomId]);

            if (messages.length === 0) {
                return [];
            }
            // 메시지 보낸 사람의 친구 이름 조회
        const senderIds = messages.map(message => message.sender_id);
        const senderIdsFormatted = senderIds.map(id => `'${id}'`).join(', ');
        console.log("채팅메시지senderIdsJoined",senderIdsFormatted)
        console.log("채팅메시지senderIds",senderIds)
        console.log("채팅메시지senderIds",senderIds[0])
        console.log("채팅메시지senderIds",senderIds[1])
        const friendNamesSql = `
            SELECT 
            f.friend_id, 
            f.friend_name  AS friend_name, 
            u.profile_img_url
        FROM 
            friend AS f
        JOIN 
            user AS u ON f.friend_id = u.user_id
        WHERE 
            f.my_id = ? AND f.friend_id IN (${senderIdsFormatted});
        `;
        const [friendNames] = await conn.execute(friendNamesSql, [userId]);
        console.log("채팅메시지임",friendNames)
        // 친구 이름 매핑
        const friendNameMap = friendNames.reduce((acc, curr) => {
            acc[curr.friend_id] = {
                name: curr.friend_name,
                profileImgUrl: curr.profile_img_url
            };
            return acc;
        }, {});
        console.log("채팅메시지임friendNameMap1",friendNameMap)
        console.log("채팅메시지임friendNameMap3",friendNames[0].profile_img_url)
        // 메시지와 친구 이름 매핑
        const mappedMessages = messages.map(message => {
            const createdAt = new Date(message.created_at);
            const dateFormatted = new Intl.DateTimeFormat('ko-KR', { dateStyle: 'full' }).format(createdAt);
            const timeFormatted = new Intl.DateTimeFormat('ko-KR', { timeStyle: 'short' }).format(createdAt);

            return {
                senderId: message.sender_id,
                senderName: message.sender_name,
                text: message.message,
                date: dateFormatted,
                time: timeFormatted,
                sender: friendNameMap[message.sender_id] || message.sender_name,
                // 현재 문제점이 일단 undefiend가 나와서 user.name을 가져와서 이름반영안되고 사진 반영도 안됨
            };
        });
        
    
        console.log("채팅메시지임",mappedMessages)
        conn.end();
        return mappedMessages
        }catch (error) {
            console.error('Error in getChatMessages', error);
            throw error;
        }
    }

    // 채팅방 참가자 정보 조회
    static async getRoomParticipants(userId,roomId) {
        const conn = await connect();
        try {
            const sql = `
            SELECT 
            u.user_id, 
            u.name, 
            u.profile_img_url, 
            f.friend_name
        FROM 
            participant AS p
        JOIN 
            user AS u ON p.user_id = u.user_id
        LEFT JOIN 
            friend AS f ON f.friend_id = u.user_id AND f.my_id = ?  -- 현재 로그인한 사용자의 ID를 바인딩
        WHERE 
            p.room_id = ?;  -- 채팅방 ID를 바인딩
        
            `;
            const [participants] = await conn.execute(sql, [userId,roomId]);
            return participants; // 참가자 목록 반환
        } catch (error) {
            console.error('Error in getRoomParticipants', error);
            throw error;
        } finally {
            await conn.end(); // 데이터베이스 연결 종료
        }
    }
}


module.exports = ChatModel;
