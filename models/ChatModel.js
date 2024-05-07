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
                WHERE p.user_id = ? AND p.visible = TRUE;
            `;
            const [chatRooms] = await conn.execute(chatRoomSql, [userId]);
            let totalUnread = 0;
            chatRooms.forEach(room => {
                totalUnread += room.unread_chat_count;
            })
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
            return {chatRooms,totalUnread};
        } catch (error) {
            console.error('Error in getUserChatRooms', error);
            throw error;
        } finally {
            await conn.end();
        }
    }

    // 채팅방 생성
    static async createChatRoom(userId, friendId){
        const conn = await connect();
        try{
            await conn.beginTransaction();

            // 본인과의 채팅방 처리
        if (userId === friendId) {
            // 본인과의 채팅방 식별자 생성
            const selfIdentifier = `${userId}_self`;
            // 기존에 '나와의 채팅'방이 있는지 확인
            const [selfRoom] = await conn.query(
                `SELECT id FROM chatting_room WHERE identifier = ?`,
                [selfIdentifier]
            );
            if (selfRoom.length > 0) {
                await conn.commit();
                return selfRoom[0].id; // 이미 존재하는 '나와의 채팅'방 ID 반환
            }
            // '나와의 채팅'방 생성
            const [chatRoomResult] = await conn.query(
                `INSERT INTO chatting_room (identifier, type) VALUES (?, 'self')`,
                [selfIdentifier]
            );
            const newSelfChatRoomId = chatRoomResult.insertId;
            // 본인을 참가자로 추가
            await conn.query(
                `INSERT INTO participant (user_id, room_id, room_name, unread_chat_count,visible) VALUES (?, ?, '나와의 채팅', 0 , TRUE)`,
                [userId, newSelfChatRoomId]
            );
            await conn.commit();
            return newSelfChatRoomId;
        }else{
            // 친구 이름 조회
            const [friendRows] = await conn.query(
                `SELECT friend_name FROM friend WHERE my_id = ? And friend_id =?`, 
                [userId,friendId]
            );
            const friendName = friendRows[0].friend_name;
            console.log("친구이름모달",friendRows[0])

            const [myRows] = await conn.query(
                `SELECT COALESCE(f.friend_name, u.name) AS friend_name
                FROM user AS u
                LEFT JOIN friend AS f ON f.friend_id = u.user_id AND f.my_id = ?
                WHERE u.user_id = ?;`, 
                [friendId,userId]
            );
            const myName = myRows[0].friend_name;

            // 고유한 채팅방 식별자
            const identifiers = [userId, friendId].sort();
            const identifier = `${identifiers[0]}_${identifiers[1]}`;
            console.log("식별자",identifier)
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
                `INSERT INTO participant (user_id, room_id, room_name, unread_chat_count, visible) VALUES (?, ?, ?, 0,TRUE)`,
                [userId, newChatRoomId,friendName]
              );

                    // 채팅방 참가자 추가 - 친구
            await conn.query(
                `INSERT INTO participant (user_id, room_id, room_name, unread_chat_count, visible) VALUES (?, ?, ?, 0, FALSE)`,
                [friendId, newChatRoomId, myName]
            );

            await conn.commit();
            return newChatRoomId;
        }
        }catch(error){
            await conn.rollback();
            console.error('Error in createChatRoom', error);
            throw error;
        } finally{
            await conn.end();
        }
    }

    // 채팅창 추가 모달 친구검색
    static async searchFriends(userId, query) {
        const conn = await connect();
        console.log("친구검색1", query);
        try {
            // query가 비어있으면 모든 친구를 반환하고, 그렇지 않으면 검색 조건을 적용합니다.
            const sql = query.trim() === "" ?
                `
                SELECT * FROM friend AS f
                JOIN user AS u ON f.friend_id = u.user_id
                WHERE f.my_id = ?
                ` :
                `
                SELECT * FROM friend AS f
                JOIN user AS u ON f.friend_id = u.user_id
                WHERE f.my_id = ? AND friend_name LIKE CONCAT('%', ?, '%')
                `;
    
            // 쿼리가 비어 있을 경우 매개변수를 조정합니다.
            const params = query.trim() === "" ? [userId] : [userId, query];
            console.log("친구검색1", params);
            const [friendsList] = await conn.execute(sql, params);
            console.log("친구정보입니다1", friendsList);
            const totalFriends = friendsList.length;
            return {friendsList, totalFriends};
        } catch (error) {
            console.error('Error searching friends:', error);
            throw error;
        } finally {
            await conn.end();
        }
    }

    //채팅방 정보 조회
    static async getChatRoomInfo(roomId,userId){
        const conn = await connect();
        try{
            const sql = `SELECT p.room_name, p.user_id
            FROM participant AS p 
            JOIN chatting_room AS cr ON p.room_id = cr.id 
            WHERE p.room_id = ? And user_id = ?`;
            const [rooms] = await conn.execute(sql, [roomId,userId]);
            conn.end();
            console.log("chatmodel1", rooms)
            console.log("chatmodel1", rooms[0].room_name)
        if(rooms.length >0) {
            return rooms;
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
            ORDER BY c.created_at ASC;
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
                u.user_id AS friend_id,
                COALESCE(f.friend_name, u.name) AS friend_name,
                u.profile_img_url
            FROM 
                user AS u
            LEFT JOIN 
                friend AS f ON f.friend_id = u.user_id AND f.my_id = ?
            WHERE 
                u.user_id IN (${senderIdsFormatted});
        `;
        const [friendNames] = await conn.execute(friendNamesSql, [userId]);
        // 친구 이름 매핑
        const friendNameMap = friendNames.reduce((acc, curr) => {
            acc[curr.friend_id] = {
                name: curr.friend_name,
                profileImgUrl: curr.profile_img_url
            };
            return acc;
        }, {});
        console.log("채팅메시지임friendNameMap1",friendNameMap)
        // console.log("채팅메시지임friendNameMap3",friendNames[0].profile_img_url)
        // 메시지와 친구 이름 매핑
        const mappedMessages = messages.map(message => {
            const createdAt = new Date(message.created_at);
            const dateFormatted = new Intl.DateTimeFormat('ko-KR', { dateStyle: 'full' }).format(createdAt);
            const timeFormatted = new Intl.DateTimeFormat('ko-KR', { timeStyle: 'short' }).format(createdAt);
            
            return {
                messageId: message.id,
                senderId: message.sender_id,
                senderName: message.sender_name,
                text: message.message,
                date: dateFormatted,
                time: timeFormatted,
                sender: friendNameMap[message.sender_id] || message.sender_name,
                unreadCount: message.unread_count
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
            f.friend_name,
            p.unread_chat_count
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
    // 채팅 메시지 저장 메소드
    static async saveChatMessage(roomId, senderId, message, isSelfChat = false) {
        const conn = await connect();
        try {
            await conn.beginTransaction(); // 트랜잭션 시작
            const unreadCount = isSelfChat ? 0 : 1;
            const sqlInsert = 'INSERT INTO chatting (room_id, sender_id, message,unread_count) VALUES (?, ?, ?, ?)';
            const results = await conn.execute(sqlInsert, [roomId, senderId, message,unreadCount]);
            const messageId = results[0].insertId;

             // 채팅방을 활성화합니다.
            const sqlUpdateRoomVisible = 'UPDATE participant SET visible = TRUE WHERE room_id = ?';
            await conn.execute(sqlUpdateRoomVisible, [roomId]);

            const sqlUpdateRead = 'UPDATE participant SET last_read_chat_id = ? WHERE user_id = ? AND room_id = ?';
            await conn.execute(sqlUpdateRead, [messageId, senderId, roomId]);
    
            const sqlUpdateUnread = 'UPDATE participant SET unread_chat_count = unread_chat_count + 1 WHERE user_id != ? AND room_id = ?';
            await conn.execute(sqlUpdateUnread, [senderId, roomId]);

            const sqlUpdateChat = 'UPDATE chatting_room SET last_chat = ? WHERE id = ?';
            await conn.execute(sqlUpdateChat, [message, roomId]);
            await conn.commit(); // 모든 쿼리가 성공적으로 실행되었으므로 트랜잭션 커밋
            console.log("Message saved");
            return messageId;
        } catch (error) {
            await conn.rollback(); // 에러 발생시 롤백
            console.error("Error saving message", error);
            throw error; // 에러를 다시 throw하여 호출자에게 전달
        } finally {
            await conn.end(); // 연결 종료
        }
    }

    static async getFriendNameByUserId(userId, friendId) {
        const conn = await connect();
        try {
            const sql = `SELECT COALESCE(f.friend_name, u.name) AS senderName
                FROM user AS u
                LEFT JOIN friend AS f ON f.friend_id = u.user_id AND f.my_id = ?
                WHERE u.user_id = ?;`;

            const [senderName] = await conn.execute(sql, [friendId, userId]);
            return senderName;
        } catch (error) {
            console.error('Error in getFriendNameByUserId', error);
            throw error;
        } finally {
            await conn.end(); // 데이터베이스 연결 종료
        }
    }

    // 채팅방 읽음 숫자 0
    static async markMessagesAsRead(userId, roomId, lastMessageId) {
        const conn = await connect();
        try {
            const sql = 'UPDATE participant SET last_read_chat_id = ?, unread_chat_count = 0 WHERE user_id = ? AND room_id = ?';
            await conn.execute(sql, [lastMessageId, userId, roomId]);
            console.log("Messages marked as read for user:", userId);
        } catch (error) {
            console.error("Error marking messages as read", error);
            throw error;
        } finally {
            await conn.end();
        }
    }
    
    static async getLatestMessageId(roomId) {
        const conn = await connect();
        try {
            const sql = `
                SELECT * FROM chatting 
                WHERE room_id = ? 
                ORDER BY created_at DESC 
                LIMIT 1;
            `;
            const [rows] = await conn.execute(sql, [roomId]);
            console.log("chat.js model", rows);
            if (rows.length > 0) {
                console.log("chat.js model1", rows[0]);
                return rows[0]; // 가장 최근 메시지의 ID 반환
            }
            return null; // 메시지가 없는 경우 null 반환
        } catch (error) {
            console.error('Error in getting latest message ID', error);
            throw error;
        } finally {
            await conn.end();
        }
    }

    static async messageReadCount(userId, roomId, lastMessageId){
        const conn = await connect();
        try {
            const sql = `
            UPDATE chatting
            SET unread_count = CASE 
                WHEN unread_count >= 1 THEN unread_count - 1 
                ELSE 0 
            END 
            WHERE id <= ? AND room_id = ? AND sender_id != ? AND unread_count > 0;
        `;
        const result = await conn.execute(sql, [lastMessageId, roomId, userId]);

         // 업데이트 후 unread_count 조회
         const selectSql = `
         SELECT unread_count FROM chatting
         WHERE id = ? AND room_id = ?;
         `;
         const [unread_count] = await conn.execute(selectSql, [lastMessageId, roomId]);
         const unreadCount = unread_count[0] ? unread_count[0].unread_count : 0; // 결과가 없을 경우 unread_count를 0으로 설정
            console.log("읽음처리 실행0",userId,roomId,lastMessageId)
            console.log("읽음처리 실행 unread:", unreadCount);
            console.log("읽음처리 실행1",result)
            return { affectedRows: result[0].affectedRows, unreadCount: unreadCount}
        } catch (error) {
            console.error("Error marking messages as read", error);
            throw error;
        } finally {
            await conn.end();
        }
    }

    static async calculateUnreadMessages(userId) {
        const conn = await connect();
        try {
            const sql = `
            SELECT sum(unread_chat_count) AS unreadCount
            FROM participant
            WHERE user_id = ?;
            `;
            const [results] = await conn.execute(sql, [userId]);
            conn.end();
            return results[0].unreadCount;
        } catch (error) {
            console.error('Error calculating unread messages:', error);
            throw error;
        } finally {
            if (conn) {
                conn.end();
            }
        }
    }
}


module.exports = ChatModel;
