const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');

dotenv.config();//require한 다음 최대한 위에 적어주는게 좋다.
//dotenv를 하는 순간 process env의 설정 값들이 들어가는데 선언한 이후부터 들어간다.
//만약 이 선언문 위에 process.env.COOKIE_SECRET 이런게 있다면 dotenv 적용이 안된다.
const pageRouter = require('./routes/page');
const {sequelize} = require('./models');

const app = express();
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});

sequelize.sync({ force: false }) //sequelize.sync()가 테이블 생성해준다.
    //테이블 정의한거 수정했다고(ex - hashtag.js 수정했다고 db의 테이블이 바로 바뀌지 않음) 테이블이 자동으로 수정되는게 아님!
    //두 가지 방법 있음 - 첫번째 force: true - 테이블이 지워졌다가 다시 생성됨(대신 데이터가 지워지는거니까 조심해야한다.)
    //alter : true - 데이터는 유지하고 테이블 컬럼 바뀐걸 반영하고 싶을 때 사용(컬럼이랑 기존 데이터들이랑 안맞아서 에러 나는 경우가 많다.
    //예를 들어 allowNull이 false인 컬럼을 추가했을 때 기존 데이터들은 그 컬럼에 해당하는 데이터가 없어서 에러 발생함)
    //일단 force: false로 해놓고 수정사항 있으면 true로 변경사항 반영 / 실무에서는 force : true 절대 쓰면 안된다. only 개발용
    .then(() => {//promise기 때문에 .then(), .catch() 붙여주면 좋음.
      console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
      console.error(err);
    });

app.use(morgan('dev'));
//app.use(express.static(__dirname)); // Current directory is root
app.use(express.static(path.join(__dirname, 'public')));//static 파일 경로 설정, __dirname 은 node 에서 제공하는 node 파일의 경로를 담고 있는 변수, "public" off of current is root
app.use(express.json()); //json 형태로 parsing
app.use(express.urlencoded({ extended: false }));// false면 기본으로 내장된 querystring 모듈을 사용하고 true면 따로 설치가 필요한 qs 모듈을 사용하여 쿼리 스트링을 해석
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false, // resave는 요청이 올 때 세션에 수정 사항이 생기지 않더라도 세션을 다시 저장할지 설정하는 것
  saveUninitialized: false, // saveUninitialized는 세션에 저장할 내역이 없더라도 처음부터 세션을 생성할지 설정
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));

app.use('/', pageRouter);

app.use((req, res, next) => { //모든 라우터들 뒤에 나오니깐 404처리 미들웨어
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error); //에러 처리 미들웨어로 넘겨줌
});

app.use((err, req, res, next) => {//에러 처리 미들웨어
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}; //개발 모드에서는 에러 상세 내역을 보여주게 하고, 개발 이외의 모드라면 안보여주게 처리하는거임.
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});
