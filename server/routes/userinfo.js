import express from 'express';
import Account from '../models/account';
import { verifyToken } from '../lib/token';
import { retrieveInfo } from '../controllers/account'
import fs from 'fs'
import path from 'path'

const router = express.Router();


router.get('/', (req, res) => {

    const auth = req.headers.authorization.split(" ");
    let token;
    if(auth[0] === 'Bearer') {
        token = auth[1]
    }
//    const token = req.body.token || req.query.token || req.headers.authorization;
    console.log(`[userinfo] ${token}`)
    if (!token) {
        return res.status(403).json({
            success: false,
            message: 'Token does not exist.'
        });
    }

    verifyToken(token)
    .then((decodedToken) => {
        return retrieveInfo(decodedToken._id)
    })
    .then((userInfo) => {
        console.log(JSON.stringify(userInfo))
        return res.json({success: true, userInfo})
    })
/*     .then(decodedToken => {
        console.log(`[userinfo] ${JSON.stringify(decodedToken)}`)
        Account.findById( decodedToken.user_id, (err, accRes) => {

            if(err) throw err;
            if(!accRes) {
                return res.status(409).json({
                    error: 'ID NOT EXISTS',
                    code: 1
                });
            }
            console.log(`[userinfo] ${JSON.stringify(accRes)}`)
            
            let account = {
                id: accRes.id,
                username: accRes.username,
                aaaNum: accRes.aaaNum,
                schoolNum: accRes.schoolNum,
                major: accRes.major,
                email: accRes.email,
                mobile: accRes.mobile,
                introduction: accRes.introduction,
                profilePath: accRes.profilePath
            }

            return res.json({success: true, account});
        })
    }) */
    .catch(err => res.status(403).json({
        success: false,
        message: err.message
    }));
})

// router.get('/profile', (req, res) => {
//     const auth = req.headers.authorization.split(" ");
//     let token;
    
//     if(auth[0] === 'Bearer') {
//         token = auth[1]
//     }

//     verifyToken(token)
//     .then(decodedToken => {
//         Account.findById( decodedToken.user_id, (err, accRes) => {
//             if(err) throw err;
//             if(!accRes) {
//                 return res.status(409).json({
//                     error: 'ID NOT EXISTS',
//                     code: 1
//                 });
//             }
// /*             
//             // [TODO] 이미지 파일 직접 보내고 받는법 고민...
//             if(accRes.profilePath) {
//                 console.log('[userinfo]' + accRes.profilePath);

//                 fs.readFile(path.resolve(path.join(__dirname, '../..', accRes.profilePath)), (err, data) => {
//                     if(err) throw err;
//                     let extention = path.extname(path.join(__dirname, '../..', accRes.profilePath))
//                     let base64Img = new Buffer(data, 'binary').toString('base64');

//                     const imgString =  `data:image/${extention.split('.').pop()};base64,${base64Img}`;
//                     return res.send(imgString)
//                 })
//                 // res.writeHead(200, {
//                 //     'Content-Type': 'image/png'
//                 // })
                
//                 //return res.sendFile(path.resolve(path.join(__dirname, '../..', accRes.profilePath)));
//             } */
//         })
//     })
//     .catch(err => res.status(403).json({
//         success: false,
//         message: err.message
//     }));
// })

export default router;