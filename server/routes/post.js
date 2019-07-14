import express from 'express';

import { verifyTokenMiddleware } from '../middlewares/auth';
import { updateContent, deleteContent } from '../controllers/content.controller';
import { retrievePost } from '../controllers/post.controller';
import { checkLike } from '../controllers/contentLike.controller';
import { retrieveAttachedFilesInContent } from "../controllers/attachedFile.controller";

import { verifyTokenUseReq } from '../lib/token';

const router = express.Router();

router.get('/:post_id', verifyTokenMiddleware, (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    verifyTokenUseReq(req)
    .then(decodedToken => {
        return Promise.all([
            retrievePost(req.params.post_id),
            checkLike(req.params.post_id, decodedToken._id),
            retrieveAttachedFilesInContent(req.params.post_id)
        ])
    })
    .then((infos) => {
        res.json({postInfo: infos[0], likeInfo: infos[1], fileInfo: infos[2]})
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
        return updateContent(req.params.post_id, req.body)
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
        return deleteContent(req.params.post_id)
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