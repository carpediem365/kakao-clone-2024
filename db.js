const mysql = require('mysql2/promise');

const dbConfig = {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '0000',
    database: 'KakaoTalkDB'
};

// const dbConfig = {
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT
// };

const connect = async () => {
    try {
      const connection = await mysql.createConnection(dbConfig);
      console.log("Database connected successfully!");
      return connection;
    } catch (error) {
      console.error("Database connection failed:", error);
      throw error;
    }
  };
  
module.exports = connect;
