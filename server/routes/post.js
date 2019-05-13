import express from 'express';
import { retrievePost, updatePost, deletePost } from '../queries/post';
import { verifyTokenUseReq } from '../lib/token';
import { checkLike } from '../queries/object';

const router = express.Router();

router.get('/:post_id', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    verifyTokenUseReq(req)
    .then(decodedToken => {
        return Promise.all([retrievePost(req.params.post_id), checkLike(decodedToken._id, req.params.post_id)])
    })
    .then((infos) => {
        res.json({postInfo: infos[0], likeInfo: infos[1]})
    })
    .catch((err) => {
        console.error(err)
        res.status(500).json()
    })
})

router.patch('/:post_id', (req, res) => {
    console.log(`[PATCH] ${req.baseUrl + req.url}`);
    verifyTokenUseReq(req)
    .then(decodedToken => {
        return updatePost(req.params.post_id, req.body)
    })
    .then(() => {
        return res.json({ success: true });
    })
    .catch((err) => {
        console.error(err)
        res.status(500).json()
    })
})

router.delete('/:post_id', (req, res) => {
    console.log(`[DELETE] ${req.baseUrl + req.url}`);
    verifyTokenUseReq(req)
    .then(decodedToken => {
        return deletePost(req.params.post_id)
    })
    .then(() => {
        return res.json({ success: true });
    })
    .catch((err) => {
        console.error(err)
        res.status(500).json()
    })
})

export default router;