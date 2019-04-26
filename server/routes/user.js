import express from 'express';
import { duplicateCheck } from '../queries/user';
import { verifyTokenUseReq } from '../lib/token';

const router = express.Router();

router.get('/:user_id', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    duplicateCheck(req.params.user_id)
    .then(() => {
        return res.json({success: true})
    })
    .catch(err => res.status(403).json({
        success: false
    }));
});

export default router;