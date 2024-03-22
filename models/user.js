const connect = require('../db');

class User {
  constructor(userId, password, phoneNumber, userName) {
    this.userId = userId;
    this.password = password;
    this.phoneNumber = phoneNumber;
    this.userName = userName;
  }

  // 회원가입 처리 메서드
  async save() {
    try {
      const conn = await connect();
      const sql = 'INSERT INTO user (userId, password, phoneNumber, userName) VALUES (?, ?, ?, ?)';
      const [result] = await conn.execute(sql, [this.userId, this.password, this.phoneNumber, this.userName]);
      conn.end();
      console.log('User saved to the database', result);
      return result;
    } catch (error) {
      console.error('Error saving user to the database:', error);
      throw error;
    }
  }

  // 이메일 중복을 확인하는 정적 메서드
  static async userIdExists(userId) {
    try {
      const conn = await connect();
      const [rows] = await conn.execute('SELECT * FROM user WHERE userId = ?', [userId]);
      conn.end();
      return rows.length > 0; // 이메일이 존재하면 true, 그렇지 않으면 false 반환
      console.log("이메일중복확인하긴함",rows)
    } catch (error) {
      console.error('Error during userId check:', error);
      throw error;
    }
  }

  static async authenticate(userId, password) {
    const conn = await connect();
    try {
      const sql = 'SELECT * FROM user WHERE userId = ? AND password = ?';
      const [rows] = await conn.execute(sql, [userId, password]);
      if (rows.length > 0) {
        console.log("로그인 성공", rows[0]);
        return new User(rows[0].userId, rows[0].password, rows[0].phoneNumber, rows[0].name);
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    } finally {
      await conn.end();
    }
  }

  // 특정 사용자의 친구 목록을 조회하는 메서드
  static async getFriendsList(userId) {
    try {
      const conn = await connect();
      const sql = `
        SELECT f.FriendID, f.FriendName 
        FROM Friend AS f 
        JOIN User AS u ON f.MyID = u.ID 
        WHERE u.UserID = ?;
      `;
      const [friends] = await conn.execute(sql, [userId]);
      conn.end();
      return friends;
    } catch (error) {
      console.error('Error fetching friend list:', error);
      throw error;
    }
  }
}





module.exports = User;