import express from 'express';
import { verifyTokenUseReq } from '../lib/token';

const router = express.Router();

/*
    GET /api/check
*/

router.get('/', (req, res) => {
    console.log('[check]');

    verifyTokenUseReq(req)
    .then(decodedToken => {
        console.log('[check] Token is valid..')
        return res.status(200).json({
            success: true
        });
    })
    .catch(err => {
        console.log('[check] Token is invalid..')
        return res.status(403).json({
            success: false,
            message: 'Token does not valid.'
        });
    })
})

export default router;
