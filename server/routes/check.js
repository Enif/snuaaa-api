import express from 'express';
import { createToken, verifyTokenUseReq } from '../lib/token';
import { retrieveInfo } from '../queries/user';

const router = express.Router();

/*
    GET /api/check
*/

router.get('/', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    let user = {};

    verifyTokenUseReq(req)
    .then(decodedToken => {
        return retrieveInfo(decodedToken._id)
    })
    .then((userInfo) => {
        user = userInfo;
        return createToken({
            _id: userInfo.user_id
        })
    })
    .then((token) => {
        return res.status(200).json({
            success: true,
            level: user.level,
            profile_path: user.profile_path,
            nickname: user.nickname,
            token 
        });
    })
    .catch(err => {
        console.error(err)
        return res.status(403).json({
            success: false,
            message: 'Token does not valid.'
        });
    })
})

export default router;
