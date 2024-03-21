const connect = require('../db');

class User {
  constructor(email, password, phonenumber, username) {
    this.email = email;
    this.password = password;
    this.phonenumber = phonenumber;
    this.username = username;
  }

  async save() {
    try {
      const conn = await connect();
      const sql = 'INSERT INTO users (email, password, phonenumber, username) VALUES (?, ?, ?, ?)';
      const [result] = await conn.execute(sql, [this.email, this.password, this.phonenumber, this.username]);
      conn.end();
      console.log('User saved to the database', result);
      return result;
    } catch (error) {
      console.error('Error saving user to the database:', error);
      throw error;
    }
  }

  // 이메일 중복을 확인하는 정적 메서드
  static async emailExists(email) {
    try {
      const conn = await connect();
      const [rows] = await conn.execute('SELECT * FROM users WHERE email = ?', [email]);
      conn.end();
      return rows.length > 0; // 이메일이 존재하면 true, 그렇지 않으면 false 반환
      console.log("이메일중복확인하긴함",rows)
    } catch (error) {
      console.error('Error during email check:', error);
      throw error;
    }
  }
}

module.exports = User;