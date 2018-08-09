
import express from 'express';
import Account from '../models/account';
import { createToken } from '../lib/token';

const router = express.Router();

/*
    ACCOUNT LOGIN: POST /api/account/login
    BODY SAMPLE: { "id": "test", "password": "test" }
    ERROR CODES:
        1: LOGIN FAILED
*/


router.post('/', (req, res) => {

//    const secret = req.app.get('jwt-secret')
    console.log('[login] ' + JSON.stringify(req.body));

    if(typeof req.body.password !== "string") {
        return res.status(401).json({
            error: "LOGIN FAILED",
            code: 1
        });
    }

//     // FIND THE USER BY USERNAME
//     Account.findOne({ id: req.body.id}, (err, account) => {
//         if(err) throw err;

//         // CHECK ACCOUNT EXISTANCY
//         if(!account) {
//             return res.status(401).json({
//                 error: "LOGIN FAILED",
//                 code: 1
//             });
//         }

//         // CHECK WHETHER THE PASSWORD IS VALID
//         if(!account.validateHash(req.body.password)) {
//             return res.status(401).json({
//                 error: "LOGIN FAILED",
//                 code: 2
//             });
//         }

//         // ALTER SESSION
// /*         let session = req.session;
//         session.loginInfo = {
//             _id: account._id,
//             username: account.username
//         }; */

//         // RETURN SUCCESS
//         return res.json({
//             success: true
//         });
//     });

    Account.findOneByUserid(req.body.id)
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
  
        // userid가 존재하고 패스워드가 일치하면 토큰 발행
        return createToken({
          userid: user.userid,
          admin: user.admin
        });
      })
      .then(token => res.json({ sucess: true, token }))
      .catch(err => res.status(403).json({ sucess: false, message: err.message }));
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