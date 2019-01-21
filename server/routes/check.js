import express from 'express';
import { verifyToken } from '../lib/token';

const router = express.Router();

/*
    GET /api/check
*/

router.get('/', (req, res) => {
    console.log('[check]');

    const auth = req.headers.authorization.split(" ");
    let token;

    if(auth[0] === 'Bearer') {
        token = auth[1]
    }

    if (!token) {
        return res.status(403).json({
            success: false,
            message: 'Token does not exist.'
        });
    }

    verifyToken(token)
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
