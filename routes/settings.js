const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
    res.render('settings')
})

router.post('/logout', (req,res) => {
    req.session.destroy(function(err) {
        if (err) {
            return res.status(500).send('로그아웃에 실패했습니다.');
        }
        res.send('로그아웃 성공');
    });
})
module.exports = router;