import express from 'express';
import Account from '../models/account';
import { verifyToken } from '../lib/token';

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
    .then(decodedToken => {
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
                introduction: accRes.introduction    
            }
            return res.json({success: true, account});
        })
    })
    .catch(err => res.status(403).json({
        success: false,
        message: err.message
    }));

    // Account.findById( req.body._id, (err, accRes) => {

    //     if(err) throw err;
    //     if(!accRes) {
    //         return res.status(409).json({
    //             error: 'ID NOT EXISTS',
    //             code: 1
    //         });
    //     }
    //     console.log(`[userinfo] ${JSON.stringify(res.body)}`)
        
    //     let account = new Account({

    //     })
    //     return res.json({ success: true });
    // })
})

export default router;