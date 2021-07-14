const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

module.exports = () => {
    passport.use(new KakaoStrategy({
        //localStrategy와는 다르게 카카오에서 발급받은 clientID를 넣어준다.
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback', //카카오 로그인 후 카카오가 결과를 전송해줄 URL
    }, async (accessToken, refreshToken, profile, done) => { //accessToken, refreshToken은 OAUTH2를 공부해보자 / 지금은 profile만 받아온다.
        console.log('kakao profile', profile);
        try {
            const exUser = await User.findOne({
                where: { snsId: profile.id, provider: 'kakao' }, //카카오로 이미 가입한 사람이 있나 찾아봄
            });
            if (exUser) { //가입한 사람이 로그인 있으면 성공
                done(null, exUser);
            } else { //없으면 회원가입 시키기
                const newUser = await User.create({
                    email: profile._json && profile._json.kakao_account_email, //이메일은 profile._json.kakao에 있음
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao',
                });
                done(null, newUser); //회원가입 후 로그인
                //회원가입과 로그인이 동시에 일어난다.
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};