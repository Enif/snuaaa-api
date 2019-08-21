import express from 'express';

import { verifyTokenMiddleware } from '../middlewares/auth';

import { checkLike, likeContent, dislikeContent } from '../controllers/contentLike.controller';
import { retrieveComments, createComment } from '../controllers/comment.controller';
import { retrieveAttachedFile, increaseDownloadCount } from "../controllers/attachedFile.controller";

const router = express.Router();

router.get('/:content_id/comments', verifyTokenMiddleware, (req, res) => {
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
            increaseDownloadCount(req.params.file_id)
            res.download(file.file_path, file.original_name);
        })
        .catch((err) => {
            res.status(500).json({ error: err })
        })
})

router.post('/:content_id/comment', verifyTokenMiddleware, (req, res) => {
    console.log(`[POST] ${req.baseUrl + req.url}`);

    // .then(() => {
    //     return updateCommentNum(req.params.content_id)
    // })
    createComment(req.decodedToken._id, req.params.content_id, req.body)
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

router.post('/:content_id/like', verifyTokenMiddleware, (req, res) => {
    console.log(`[POST] ${req.baseUrl + req.url}`);

    const content_id = req.params.content_id;
    let user_id = req.decodedToken._id

    checkLike(content_id, user_id)
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