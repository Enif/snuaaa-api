import express from 'express';
import { verifyTokenUseReq } from '../lib/token';
import { retrieveInfo } from '../controllers/user'

const router = express.Router();

router.get('/', (req, res) => {

    verifyTokenUseReq(req)
    .then((decodedToken) => {
        return retrieveInfo(decodedToken._id)
    })
    .then((userInfo) => {
        return res.json({success: true, userInfo})
    })
    .catch(err => res.status(403).json({
        success: false,
        message: err.message
    }));
})

export default router;