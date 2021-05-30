const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {//회원가입 라우터
    //async로 가려면 inNotLoggedIn을 통과해야 하므로, 로그인 안한 사람들만 접근할 수 있게 해줌
    const { email, nick, password } = req.body; //이메일, 이름, 비밀번호를 받아와서
    try {
        const exUser = await User.findOne({ where: { email } }); //가입했던 이메일인지 확인해준다.
        if (exUser) {
            return res.redirect('/join?error=exist');//있으면 ?error=exist라는 쿼리 스트링을 붙여서 redirect 해줌.
            //그러면 프론트엔트 개발자는 이 쿼리 스트링을 보고 이미 이메일이 존재하는 이메일이구나를 알아차림
        }
        const hash = await bcrypt.hash(password, 12);
        //유저 생성, 회원가입 할 때 hash화를 해서 회원가입시킴.(두번째 인자는 얼마나 복잡하게 할 것인지임, 숫자가 클수록 해킹 위험은 적지만 오래 걸림.)
        await User.create({
            email,
            nick,
            password: hash, //비밀번호만 hash화 해서 유저 생성
        });
        return res.redirect('/'); //DB에 생성한 후 redirect로 메인 페이지로 돌아가기
    } catch (error) {
        console.error(error);
        return next(error);
    }
});
//로그인은 세션 문제도 있고, SNS로 로그인 할 때 local로 로그인 할 때가 달라서 로직이 복잡해지기 때문에 passport 라이브러리를 사용한다.
//프론트에서 서버로 로그인 요청을 보낼 때 아래의 라우터가 실행되는데, 그 때 passport.authenticate('local')까지 실행되고
//이게 실행되면 localStrategy.js을 찾아가서 그 파일을 실행한다!!
router.post('/login', (req, res, next) => {
    //req.user -> 로그인 하기 전이니까 안들어 있음.
    passport.authenticate('local', (authError, user, info) => { //미들웨어 확장하는 패턴!
        if (authError) { //서버 에러 발생한 경우
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            return res.redirect(`/?loginError=${info.message}`); //로그인이 실패한 경우 메시지를 담아서 프론트로 넘겨줌
        }
        return req.login(user, (loginError) => {//로그인이 성공한 경우 req.login을 사용하며 사용자 객체(user)를 넣어준다.
            //req.login을 하는 순간 req.login(user, )까지만 실행되고 passport/index.js으로 가서 passport.serializeUser((user, done) 이걸 실행한다.
            if (loginError) {
                console.error(loginError);
                return next(loginError); //에러가 있었으면 에러 처리하러 가고
            }
            //여기서 세션 쿠키를 브라우져로 보내준다. 그 다음 요청 부터는 세션 쿠키가 보내져서 서버가 누가 로그인 했는지 알게 되는거
            return res.redirect('/'); //없었으면 메인 페이지로 돌아가고 로그인 성공!
        });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙인다. (이게 미들웨어 확장법)
});

router.get('/logout', isLoggedIn, (req, res) => { //로그인 한 사람만 로그아웃 할 수 있게 isLoggedIn 추가함.
                                                  //req.user -> 로그인 되어 있는 상태니까 들어있음
    req.logout(); //이거 실행하면 서버에서 세션 쿠키를 삭제해버림 -> 로그인이 됐는지 안됐는지는 세션에 세션 쿠키가 들어 있나 없나를 확인하는 것이기 때문에 없으면 로그아웃됨을 알 수 있다.
    req.session.destroy();
    res.redirect('/');
});

// 이 부분은 카카오 로그인 전력
router.get('/kakao', passport.authenticate('kakao')); //카카오 로그인하기를 누르면 passport.authenticate('kakao')가 실행된다. -> 이게 실행되면 kakaoStrategy.js으로 간다. 그리고 카카오 홈페이지 갔다옴

router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/', //카카오 로그인 실패시 여기로 옴
}), (req, res) => { //kakaoStrategy에서 로그인에 성공했으면 여기로 온다.
    res.redirect('/');
});
//근데 /kakao/callback 요청을 한적이 없는데?? -> 카카오에서 이쪽으로 요청을 쏴줌
module.exports = router;