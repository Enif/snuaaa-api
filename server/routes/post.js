import express from 'express';
import { retrievePost } from '../queries/post';
import { verifyTokenUseReq } from '../lib/token';
import { checkLike } from '../queries/object';

const router = express.Router();

router.get('/:id', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    verifyTokenUseReq(req)
    .then(decodedToken => {
        return Promise.all([retrievePost(req.params.id), checkLike(decodedToken._id, req.params.id)])
    })
    .then((infos) => {
        res.json({postInfo: infos[0], likeInfo: infos[1]})
    })
    .catch((err) => {
        res.status(500).json({ error: err })
    })
})

export default router;