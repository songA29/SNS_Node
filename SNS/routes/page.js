const express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('middlewares');
const {Post, User} = require('../models');

const router = express.Router();


router.use((req, res, next) =>{
    res.locals.users = req.user; //req.user는 passport의 deserializeUser에서 나온거
    res.locals.followerCount = 0;
    res.locals.followingCount = 0;
    res.locals.followerIdList = [];
    next();
});

router.get('/profile', (req,res) =>{
    res.render('profile', {title: '내 정보 - NodeBird'});
});

router.get('/join', (req, res) => {
    res.render('join', {title: '회원가입 - NodeBird'});
})

router.get('/', async (req, res, next) =>{
    try {
        const posts = await Post.findAll({ //업로드한 게시물 찾기
            include : {
                model: User,
                attributes: ['id', 'nick'],
            },
            order: [['createdAt', 'DESC']],
        });
        res.render('main', { //찾은 게시물을 twits에
            title: 'NodeBird',
            twits: posts,
        });
    }
    catch (err){
        console.error(err);
        next(err);
    }
});

module.exports = router;