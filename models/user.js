const connect = require('../db');

class User {
  constructor(userid, password, phonenumber, username) {
    this.userid = userid;
    this.password = password;
    this.phonenumber = phonenumber;
    this.username = username;
  }

  async save() {
    try {
      const conn = await connect();
      const sql = 'INSERT INTO users (email, password, phone, name) VALUES (?, ?, ?, ?)';
      const [result] = await conn.execute(sql, [this.email, this.password, this.phone, this.name]);
      conn.end();
      console.log('User saved to the database', result);
      return result;
    } catch (error) {
      console.error('Error saving user to the database:', error);
      throw error;
    }
  }

  // 다른 메서드 추가 가능 (예: findByEmail, authenticate 등)
}

module.exports = User;
