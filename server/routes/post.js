import express from 'express';

import { verifyTokenMiddleware } from '../middlewares/auth';

import { updateContent, deleteContent, increaseViewNum } from '../controllers/content.controller';
import { retrievePost } from '../controllers/post.controller';
import { checkLike } from '../controllers/contentLike.controller';


const router = express.Router();

router.get('/:post_id', verifyTokenMiddleware, (req, res, next) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    let resPostInfo = {}

    retrievePost(req.params.post_id)
        .then((postInfo) => {
            resPostInfo = postInfo;

            if (postInfo.board.lv_read > req.decodedToken.level) {
                const err = {
                    status: 403,
                    code: 4001
                }
                next(err);
            }
            else {
                return Promise.all([
                    checkLike(req.params.post_id, req.decodedToken._id),
                    increaseViewNum(req.params.post_id)
                ])
            }
        })
        .then((infos) => {
            res.json({ postInfo: resPostInfo, likeInfo: infos[0] })
        })
        .catch((err) => {
            console.error(err)
            res.status(500).json()
        })
})

router.patch('/:post_id', verifyTokenMiddleware, (req, res) => {
    console.log(`[PATCH] ${req.baseUrl + req.url}`);

    updateContent(req.params.post_id, req.body)
        .then(() => {
            return res.json({ success: true });
        })
        .catch((err) => {
            console.error(err)
            res.status(500).json()
        })
})

router.delete('/:post_id', verifyTokenMiddleware, (req, res) => {
    console.log(`[DELETE] ${req.baseUrl + req.url}`);
    
    deleteContent(req.params.post_id)
        .then(() => {
            return res.json({ success: true });
        })
        .catch((err) => {
            console.error(err)
            res.status(500).json()
        })
})

export default router;
