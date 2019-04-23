
import express from 'express';
import { retrieveLoginInfo } from '../queries/user'
import { createToken } from '../lib/token';

const router = express.Router();

/*
    [TODO] MAKE SAMLE..
    ACCOUNT LOGIN: POST /api/login
    BODY SAMPLE: { "id": "test", "password": "test" }
    ERROR CODES:
        1: LOGIN FAILED
*/

router.post('/', (req, res) => {

    console.log(`[POST] ${req.baseUrl + req.url}`);

    if(typeof req.body.password !== "string") {
        return res.status(401).json({
            error: "LOGIN FAILED",
            code: 1
        });
    }

    let user = {};

    retrieveLoginInfo({id: req.body.id, password:req.body.password})
    .then((userInfo) => {
        user = userInfo;
        return createToken({
            _id: userInfo.user_id
        })
    })
    .then(token => res.json({
        sucess: true,
        level: user.level,
        profile_path: user.profile_path,
        nickname: user.nickname,
        token 
    }))
    .catch(err => {
        console.error(err);
        return res.status(403).json({
            sucess: false,
            message: 'Login Info is not valid.' 
        })
    });
});

export default router;