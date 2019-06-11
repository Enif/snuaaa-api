import express from 'express';

import { loginUser, updateLoginDate } from '../controllers/user.controller';

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

    loginUser(req)
    .then((user) => {
        userInfo = user;
        return updateLoginDate(userInfo.user_id)
    })
    .then(() => {
        return createToken({
            _id: userInfo.user_id
        })
    })
    .then((token) => {
        return res.json({
            sucess: true,
            user_id: userInfo.user_id,
            level: userInfo.level,
            profile_path: userInfo.profile_path,
            nickname: userInfo.nickname,
            token 
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