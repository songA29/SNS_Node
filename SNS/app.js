const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');

dotenv.config();
const pageRouter = require('./routes/page');

const app = express();
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
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
