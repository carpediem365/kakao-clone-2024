const path = require('path');

const config = {
    BASE_URL: "http://192.168.0.16:3000",
    uploadPath: path.join(__dirname, '../public/uploads')
}

module.exports = config;