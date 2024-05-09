const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/', async (req, res) => {
    const { userId, password } = req.body;
    try {
        const user  = await User.authenticate(userId, password);
        if (user) {
            req.session.user = { 
                user_id: user.user_id, 
                name: user.name,
                phone_number: user.phone_number, }; // 사용자 정보 세션에 저장
            res.redirect('/friends');
           
        } else {
            // 로그인 실패 시 로그인 페이지로 리다이렉트 및 오류 메시지 전달
            res.render('login', { errorMessage: '아이디 또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요.' });
        }
    } catch (error) {
        res.status(500).send('서버 에러입니다.');
    }
});

module.exports = router;
