const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
  passport.serializeUser((user, done) => { //auth.js에서 여기로 넘어온다.
    done(null, user.id); //그러면 user.id만 뽑아서 done을 해준다. -> req.session 객체에 user의 id만 저장한다.
    //user만 쓰면 유저를 통째로 저장할 수 있긴 하지만 서버 메모리를 너무 많이 잡아먹기 때문에 id만 저장함
    //세션에 아이디를 저장해야 되는 이유 : 메모리에 { id: 3, 'connect.sid': s%1242535325356 } 이런식으로 저장되는데
    //connect.sid는 세션 쿠키임. 세션 쿠키는 브라우저로 간다. 브라우저에서 요청을 보낼 때마다 쿠키를 같이 넣어서 보내줌.
    //서버가 이 쿠키를 보고 3번 사용자의 쿠키구나 라는걸 인식함
    //그리고 3번 사용자를 deserializeUser해서 복구를 해줌
    //done 되는 순간 auth.js의 나머지 부분을 실행하러 돌아감
  });


//req.session에 저장된 사용자 아이디를 바탕으로 DB 조회를 하여 사용자 정보를 얻어낸 후 유저 정보 전체를 복구해서 req.user에 저장해줌.
  passport.deserializeUser((id, done) => { //id == user.id
    User.findOne({ where: { id } })
      .then(user => done(null, user)) //여기의 user가 req.user에 저장된다.
      .catch(err => done(err));
  });
// 로그인 되어 있을 때 req.user을 하면 로그인한 사용자의 정보가 나옴, req.isAuthenticated()은 로그인 했으면 true 아니면 false 반환.

  local();
  kakao();
};