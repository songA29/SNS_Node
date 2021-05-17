const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

router.post('/login', (req, res, next) => {
    //req.user 없음, 로그인 전이다
    passport.authenticate('local', )
})