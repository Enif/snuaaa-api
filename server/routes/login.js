import express from 'express';
import bcrypt from 'bcryptjs';

import { retrieveLoginUser, updateLoginDate } from '../controllers/user.controller';

import { createToken } from '../lib/token';

const router = express.Router();

router.post('/', (req, res) => {

    console.log(`[POST] ${req.baseUrl + req.url}`);

    if(typeof req.body.password !== "string") {
        return res.status(401).json({
            error: "LOGIN FAILED",
            code: 1
        });
    }

    let userInfo = {};

    retrieveLoginUser(req.body.id)
    .then((user) => {
        return new Promise((resolve, reject) => {
            if (!user) {
                reject('id is not correct');
            }
            else if (bcrypt.compareSync(req.body.password, user.password)) {
                userInfo = user;
                resolve();
            }
            else {
                reject('password is not correct');
            }
        })
    })
    .then(() => {
        return updateLoginDate(userInfo.user_id)
    })
    .then(() => {
        return createToken({
            _id: userInfo.user_id,
            level: userInfo.level,
            autoLogin: req.body.autoLogin ? true : false
        })
    })
    .then((token) => {
        return res.status(200)
        .cookie('token', token, {
            path: '/',
            // domain: 'localhost:3000'
            // httpOnly: true
        })
        .json({
            sucess: true,
            user_id: userInfo.user_id,
            level: userInfo.level,
            profile_path: userInfo.profile_path,
            nickname: userInfo.nickname,
            autoLogin: req.body.autoLogin ? true : false,
            token: token 
        })
    })
    .catch((err) => {
        console.error(err);
        return res.status(403).json({
            sucess: false,
            message: 'Login Info is not valid.' 
        })
    })
});

export default router;