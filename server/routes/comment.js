import express from 'express';
import { updateComment, deleteComment, retrieveCommentById } from '../queries/comment';
import { updateCommentNum } from '../queries/object';
import { verifyTokenUseReq } from '../lib/token';

const router = express.Router();

router.patch('/:comment_id', (req, res) => {
    console.log(`[PATCH] ${req.baseUrl + req.url}`);

    verifyTokenUseReq(req)
        .then(() => {
            return updateComment(req.params.comment_id, req.body.contents)  
        })
        .then(() => {
            res.json({ success: true });
        })
        .catch(err => {
            console.error(err);
            res.status(403).json({
            success: false
        });
    });
        
});

router.delete('/:comment_id', (req, res) => {
    console.log(`[DELETE] ${req.baseUrl + req.url}`);

    let parent_id = '';
    verifyTokenUseReq(req)
        .then(() => {
            return retrieveCommentById(req.params.comment_id)
        })
        .then((info) => {
            parent_id = info.parent_id;
            return deleteComment(req.params.comment_id)
        })
        .then(() => {
            return updateCommentNum(parent_id)
        })
        .then(() => {
            res.json({ success: true });
        })
        .catch(err => {
            console.error(err);
            res.status(403).json({
            success: false
        })
    });
});


export default router;