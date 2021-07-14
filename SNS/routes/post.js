const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

try { //uploads 폴더에 파일들을 업로드 하는데 없으면 안되니깐 없다면 생성
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({ //업로드 미들웨어
    storage: multer.diskStorage({ //diskStorage는 이미지를 서버 디스크에 저장
        destination(req, file, cb) { //저장 경로
            cb(null, 'uploads/'); //uploads 폴더에 img를 업로드
        },
        filename(req, file, cb) { //저장 파일명
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext); //파일명은 원래 파일명에 날짜를 더해서 만들어주겠다.
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});


//이미지 업로드하는 라우터
router.post('/img', isLoggedIn,
    upload.single('img'), (req, res) => { //요청 본문의 img에 담긴 이미지 하나를 읽어 설정대로 저장하는 미들웨어

        //로그인한 사람이 post /img 요청을 보내면서 form에서 img라는 키로 이미지를 업로드해야되며 key가 일치해야된다.
        console.log(req.file);
        res.json({ url: `/img/${req.file.filename}` }); //업로드 완료하면 이 파일을 요청할 수 있는 url을 프론트로 돌려보내줌 / 실제 파일은 uploads에 있는데 요청 주소는 img/임 -> express static이 이 역할 수행
    });

module.exports = router;