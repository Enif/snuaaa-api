import express from 'express';

import { checkLike, likeContent, dislikeContent } from '../controllers/contentLike.controller';
import { retrieveComments, createComment } from '../controllers/comment.controller';
import { retrieveAttachedFile } from "../controllers/attachedFile.controller";
import { verifyTokenUseReq } from '../lib/token';

const router = express.Router();

router.get('/:content_id/comments', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    retrieveComments(req.params.content_id)
        .then((comments) => {
            res.json(comments)
        })
        .catch((err) => {
            res.status(500).json({ error: err })
        })
})

router.get('/:content_id/file/:file_id', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    retrieveAttachedFile(req.params.file_id)
        .then((file) => {
            res.download(file.file_path, file.original_name);
        })
        .catch((err) => {
            res.status(500).json({ error: err })
        })
})

router.post('/:content_id/comment', (req, res) => {
    console.log(`[POST] ${req.baseUrl + req.url}`);

    verifyTokenUseReq(req)
        .then(decodedToken => {
            return createComment(decodedToken._id, req.params.content_id, req.body)
        })
        // .then(() => {
        //     return updateCommentNum(req.params.content_id)
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

router.post('/:content_id/like', (req, res) => {
    console.log(`[POST] ${req.baseUrl + req.url}`);

    let user_id;
    const content_id = req.params.content_id;

    verifyTokenUseReq(req)
        .then(decodedToken => {
            user_id = decodedToken._id
            return checkLike(content_id, user_id)
        })
        .then((isLiked) => {
            if (isLiked) {
                return dislikeContent(content_id, user_id)
            }
            else {
                return likeContent(content_id, user_id)
            }
        })
        // .then(() => {
        //     return updateLikeNum(content_id)
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