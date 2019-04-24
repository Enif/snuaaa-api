import express from 'express';
import { retrieveComments, createComment, updateComment, deleteComment } from '../queries/comment';
import { updateCommentNum, updateLikeNum, checkLike, likeObject, dislikeObject } from '../queries/object';
import { verifyTokenUseReq } from '../lib/token';

const router = express.Router();

router.get('/:object_id/comment', (req, res) => {
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
        .then(() => {
            return updateCommentNum(req.params.object_id)
        })
        .then(() => {
            res.json({ success: true });
        })
        .catch(err => res.status(403).json({
            success: false,
            message: err.message
        }));
});

router.post('/:object_id/like', (req, res) => {
    console.log(`[POST] ${req.baseUrl + req.url}`);

    let user_id;
    const object_id = req.params.object_id;

    verifyTokenUseReq(req)
        .then(decodedToken => {
            user_id = decodedToken._id
            return checkLike(user_id, object_id)  
        })
        .then((isLiked) => {
            console.log(isLiked)
            if(isLiked) {
                console.log('isLiked')
                return dislikeObject(user_id, object_id)
            }
            else {
                console.log('is not Liked')
                return likeObject(user_id, object_id)
            }
        })
        .then(() => {
            return updateLikeNum(object_id)
        })
        .then(() => {
            res.json({ success: true });
        })
        .catch(err => res.status(403).json({
            success: false,
            message: err.message
        }));
});

export default router;