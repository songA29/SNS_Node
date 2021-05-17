const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, async (email, password, done)=>{
        try {
            const exUser = await User.findOne({ where: { email } });
            if (exUser) { //이메일 가진 사람이 있으면
                const result = await bcrypt.compare(password, exUser.password); //프론트에서 받은 비밀번호와 DB의 비밀번호를 비교해서 true, false를 리턴
                if (result) { //비번 일치
                    done(null, exUser); //첫번째 인수 기본적으로 null, 두번째는 성공했을 경우에는 유저 객체를 넣어줌.
                    //그리고 done이 실행되면 아까 auth.js에서 실행하다 여기로 넘어왔는데 나머지를 실행하러 다시 돌아간다.
                } else { //비번 불일치
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.' }); //실패했을 때는 두번째 인자에 false, 세번째는 실패 이유
                }
            } else { //이메일 가진 사람이 없을 때
                done(null, false, { message: '가입되지 않은 회원입니다.' });
            }
        }
        catch (error){
            console.error(error);
            done(error);
        }
    }));
};