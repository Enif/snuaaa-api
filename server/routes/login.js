
import express from 'express';
import Account from '../models/account';
import { logIn } from '../controllers/account'
import { createToken } from '../lib/token';

const router = express.Router();

/*
    ACCOUNT LOGIN: POST /api/account/login
    BODY SAMPLE: { "id": "test", "password": "test" }
    ERROR CODES:
        1: LOGIN FAILED
*/


router.post('/', (req, res) => {

    console.log('[login] ' + JSON.stringify(req.body));
    if(typeof req.body.password !== "string") {
        return res.status(401).json({
            error: "LOGIN FAILED",
            code: 1
        });
    }

    logIn({id: req.body.id, password:req.body.password})
    .then((_id) => {
        return createToken({
            _id: _id
        })
    })
    .then(token => res.json({ sucess: true, token }))
    .catch(err => res.status(403).json({ sucess: false, message: err }));


/*     Account.findOneByUserid(req.body.id)
    .then(user => {
        // user 미존재: 회원 미가입 사용자
        if (!user) { 
            return res.status(401).json({
                error: "LOGIN FAILED",
                code: 1
            });
        }
  
        // 패스워드 체크
        if (!user.validateHash(req.body.password)) {
            return res.status(401).json({
                error: "LOGIN FAILED",
                code: 1
            });
        }

        console.log(`[routes>login] : ${JSON.stringify(user)}`);
  
        // userid가 존재하고 패스워드가 일치하면 토큰 발행
        return createToken({
          user_id: user._id,
          id: user.id,
          username: user.username
        });
    })
    .then(token => res.json({ sucess: true, token }))
    .catch(err => res.status(403).json({ sucess: false, message: err.message })); */
});

export default router;
/* 
const p = new Promise((resolve, reject) => {
    createToken({
        userid: req.body.id
    })
})
.then

const p = new Promise((resolve, reject) => {
    jwt.sign(
        {
            _id: user._id,
            username: user.username,
            admin: user.admin
        }, 
        secret, 
        {
            expiresIn: '7d',
            issuer: 'velopert.com',
            subject: 'userInfo'
        }, (err, token) => {
            if (err) reject(err)
            resolve(token) 
        })
})
return p

    // respond the token 
    const respond = (token) => {
        res.json({
            message: 'logged in successfully',
            token
        })
    } */    