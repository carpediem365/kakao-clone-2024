const User = require('../models/user');

exports.getSignup = (req,res) => {
    res.render('signup.html');
    console.log("get")
}

exports.postSignup = async (req, res) => {
    console.log("post")
    try {
        console.log('회원가입 요청 수신:', req.body); // 요청 로그
        const { email, password, phone, name } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User(email, hashedPassword, phone, name);
        console.log('데이터베이스에 저장 시도:', newUser); // 저장 시도 로그

        await newUser.save();
        console.log('회원가입 성공:', email); // 회원가입 성공 로그

        res.redirect('/views/index');
    } catch (err) {
        console.error(err);
        console.error('회원가입 오류:', err); // 오류 로그
        res.redirect('/views/signup');
    }
};