import express from 'express';

import { checkLike, likeContent, dislikeContent } from '../controllers/contentLike.controller';
import { retrieveComments, createComment } from '../controllers/comment.controller';

import { verifyTokenUseReq } from '../lib/token';

const router = express.Router();

router.get('/:object_id/comments', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    retrieveComments(req.params.object_id)
        .then((comments) => {
            res.json(comments)
        })
        .catch((err) => {
            res.status(500).json({ error: err })
        })
})

router.post('/:object_id/comment', (req, res) => {
    console.log(`[POST] ${req.baseUrl + req.url}`);

    verifyTokenUseReq(req)
        .then(decodedToken => {
            return createComment(decodedToken._id, req.params.object_id, req.body)
        })
        // .then(() => {
        //     return updateCommentNum(req.params.object_id)
        // })
        .then(() => {
            res.json({ success: true });
        })
        .catch(err => {
            console.error(err);
            return res.status(403).json({
                success: false,
                message: err.message
            })
        });
});

router.post('/:object_id/like', (req, res) => {
    console.log(`[POST] ${req.baseUrl + req.url}`);

    let user_id;
    const object_id = req.params.object_id;

    verifyTokenUseReq(req)
        .then(decodedToken => {
            user_id = decodedToken._id
            return checkLike(object_id, user_id)
        })
        .then((isLiked) => {
            if (isLiked) {
                return dislikeContent(object_id, user_id)
            }
            else {
                return likeContent(object_id, user_id)
            }
        })
        // .then(() => {
        //     return updateLikeNum(object_id)
        // })
        .then(() => {
            res.json({ success: true });
        })
        .catch((err) => {
            console.error(err);
            return res.status(403).json({
                success: false,
            })
        })
});

export default router;