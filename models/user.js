const connect = require('../db');

class User {
  constructor(userId, passWord, phoneNumber, userName) {
    this.userId = userId;
    this.passWord = passWord;
    this.phoneNumber = phoneNumber;
    this.userName = userName;
  }

  // 회원가입 처리 메서드
  async save() {
    try {
      const conn = await connect();
      const sql = 'INSERT INTO User (user_id, password, phone_number, name) VALUES (?, ?, ?, ?)';
      await conn.execute(sql, [this.userId, this.passWord, this.phoneNumber, this.userName]);

      // const friendSql = 'INSERT INTO Friend (my_id) VALUES (?)';
      // await conn.execute(friendSql, [this.userId]); 
      
      conn.end();
      console.log('User saved to the database');
    } catch (error) {
      console.error('Error saving user to the database:', error);
      throw error;
    }
  }

  // async save() {
  //   const conn = await connect();
  //   try {
  //     await conn.beginTransaction(); // 트랜잭션 시작
  
  //     const userSql = 'INSERT INTO User (user_id, password, phone_number, name) VALUES (?, ?, ?, ?)';
  //     await conn.execute(userSql, [this.userId, this.passWord, this.phoneNumber, this.userName]);
  
  //     const friendSql = 'INSERT INTO Friend (my_id) VALUES (?)';
  //     await conn.execute(friendSql, [this.userId]);
  
  //     await conn.commit(); // 트랜잭션 커밋
  //     console.log('User and friend data saved to the database');
  //   } catch (error) {
  //     await conn.rollback(); // 트랜잭션 롤백
  //     console.error('Error during database transaction, rolled back:', error);
  //     throw error;
  //   } finally {
  //     conn.end();
  //   }
  // }
  

  // 이메일 중복을 확인하는 정적 메서드
  static async userIdExists(userId) {
    try {
      const conn = await connect();
      const [rows] = await conn.execute('SELECT * FROM user WHERE user_id = ?', [userId]);
      conn.end();
      return rows.length > 0; // 이메일이 존재하면 true, 그렇지 않으면 false 반환
      console.log("이메일중복확인하긴함",rows)
    } catch (error) {
      console.error('Error during userId check:', error);
      throw error;
    }
  }

  static async authenticate(userId, passWord) {
    const conn = await connect();
    try {
      const sql = 'SELECT * FROM user WHERE user_id = ? AND password = ?';
      const [rows] = await conn.execute(sql, [userId, passWord]);
      if (rows.length > 0) {
        console.log("로그인 성공", rows[0]);
        return rows[0];
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    } finally {
      await conn.end();
    }
  }


  // 친구 목록 조회
  static async getFriendsList(userId){
    try{
      const conn = await connect();
      const friendsQuery  = `
        SELECT 
        f.friend_id, 
        f.friend_name, 
        u.profile_img_url,
        u.background_img_url,
        u.status_message
    FROM 
        friend AS f
    JOIN 
        user AS u ON f.friend_id = u.user_id
    WHERE 
        f.my_id = ?;
    
      `;
      const [friendsList] = await conn.execute(friendsQuery , [userId]);

      const countQuery = 'SELECT COUNT(*) AS totalFriends FROM friend WHERE my_id = ?';
      const [[totalFriends]] = await conn.execute(countQuery, [userId]);
      console.log("total friends: " + totalFriends)
      conn.end();
      return {
        friendsList,
        totalFriends: totalFriends.totalFriends
      }
      
    }catch(error){
      console.error('Error fetching friend list:', error);
      throw error;
    }
  }

  // 프로필 정보 조회
  static async getProfileInfo(userId) {
    try {
      const conn = await connect();
      const sql = 'SELECT user_id , name, status_message, profile_img_url,background_img_url FROM user WHERE user_id = ?';
      const [profile] = await conn.execute(sql, [userId]);
      conn.end();
      return profile[0];
    } catch (error) {
      console.error('Error fetching profile info:', error);
      throw error;
    }
  }
// 친구 프로필 모달창 띄우는 정보 조회
  static async getFriendProfileInfo(friendId,userId) {
    try {
      const conn = await connect();
      const sql = 'SELECT user_id , name, status_message, profile_img_url,background_img_url FROM user WHERE user_id = ?';
      const [profile] = await conn.execute(sql, [friendId]);
      const friendSql = 'SELECT friend_name from friend where friend_id = ? AND my_id = ?'
      const [friendProfile] = await conn.execute(friendSql, [friendId,userId]);
      conn.end();
      return [profile[0],friendProfile[0]];
    } catch (error) {
      console.error('Error fetching profile info:', error);
      throw error;
    }
  }

  static async checkUserAndFriendship(userId, friendId) {
    try {
      const conn = await connect();
      // 친구 ID 존재 여부 확인
      const [friendExists] = await conn.execute('SELECT name,profile_img_url FROM user WHERE user_id = ?', [friendId]);
      if (friendExists.length === 0) {
          throw new Error(`'${friendId}'는 존재하지 않는 ID입니다.`);
      }

      // 이미 친구인지 여부 확인
      const [alreadyFriends] = await conn.execute('SELECT * FROM friend WHERE my_id = ? AND friend_id = ?', [userId, friendId]);
      if (alreadyFriends.length > 0) {
        return { exists: true, userInfo: friendExists[0], message: "이미 친구로 등록된 ID입니다." };
      }

      // 본인 id인지 여부확인
      if(userId === friendId){
        return { exists: true, userInfo: friendExists[0], message: '본인의 ID로는 친구 추가를 할 수 없습니다.' };
      }
      // 모든 체크가 통과되면 사용자 정보 반환
      return { exists: true, userInfo: friendExists[0] };
  } catch (error) {
      console.error('checkUserAndFriendship 중 에러 발생:', error);
      throw error;
  }
}

static async addFriend(userId, friendId) {
  try {
      const conn = await connect();
      // 친구 ID 존재 여부 확인
      const [friendExists] = await conn.execute('SELECT * FROM user WHERE user_id = ?', [friendId]);
      if (friendExists.length === 0) {
          throw new Error(`'${friendId}'는 존재하지 않는 ID입니다.`);
      }

      // 이미 친구인지 여부 확인
      const [alreadyFriends] = await conn.execute('SELECT * FROM friend WHERE my_id = ? AND friend_id = ?', [userId, friendId]);
      if (alreadyFriends.length > 0) {
          throw new Error(`'${friendId}'는 이미 친구로 등록된 ID입니다.`);
      }

     console.log("이건 뭘까요?", friendExists)
      // 친구추가
      const result = await conn.execute('INSERT INTO friend (my_id, friend_id,friend_name) VALUES (?, ?, ?)', [userId, friendId,friendExists[0].name]);
      conn.end();
      return result[0].affectedRows > 0;
  } catch (error) {
      console.error('친구 추가 중 에러 발생:', error);
      throw error;
  }
}

 // 프로필 업데이트 메서드
 static async updateProfile(userId, updatedData) {
  try {
      const conn = await connect();
      let updateQuery = 'UPDATE user SET ';
      const queryParams = [];

      // 데이터를 동적으로 처리
      for (let [key, value] of Object.entries(updatedData)) {
          updateQuery += `${key} = ?, `;
          queryParams.push(value);
      }
      console.log("업데이트 쿼리", updateQuery)
      let updateQuery1 = updateQuery.slice(0, -2)
      console.log("업데이트 쿼리", updateQuery1)
      updateQuery = updateQuery.slice(0, -2) + ' WHERE user_id = ?'; // 마지막 쉼표 제거
      queryParams.push(userId);

      const [result] = await conn.execute(updateQuery, queryParams);
      conn.end();

      return result.affectedRows > 0;
  } catch (error) {
      console.error('Error updating profile in User model:', error);
      throw error;
  }
}

 // 친구 이름 업데이트 메서드
 static async updateFriendName(myId, friendId, newName) {
  try {
    const conn = await connect();
    const sql = 'UPDATE friend SET friend_name = ? WHERE my_id = ? AND friend_id = ?';
    const result = await conn.execute(sql, [newName, myId, friendId]);
    conn.end();
    return result[0].affectedRows > 0;
  } catch (error) {
    console.error('Error updating friend name:', error);
    throw error;
  }
}

static async updateDefaultImage(userId, imagePath, imageType){
  try{
    const conn = await connect();
    let updateQuery = `UPDATE user SET ${imageType === 'profile' ? 'profile_img_url' : 'background_img_url'} = ? WHERE user_id = ?`;
    await conn.execute(updateQuery, [imagePath, userId]);
    conn.end();
    return true;
  } catch (error) {
      console.error('Error updating default image:', error);
      throw error;
  }
}

}


module.exports = User;