import express from 'express';

import { verifyTokenMiddleware } from '../middlewares/auth';

import { updateComment, deleteComment } from '../controllers/comment.controller';

const router = express.Router();

router.patch('/:comment_id', verifyTokenMiddleware, (req, res) => {
    

    updateComment(req.params.comment_id, req.body)
        .then(() => {
            res.json({ success: true });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'internal server error',
                code: 0
            });
        });

});

router.delete('/:comment_id', verifyTokenMiddleware, (req, res) => {
    

    deleteComment(req.params.comment_id)
        .then(() => {
            res.json({ success: true });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'internal server error',
                code: 0
            });

            // .then(() => {
            //     return retrieveCommentById(req.params.comment_id)
            // })
            // .then((info) => {
            //     parent_id = info.parent_id;
            //     return deleteComment(req.params.comment_id)
            // })
            // .then(() => {
            //     return updateCommentNum(parent_id)
            // })
            // .then(() => {
            //     res.json({ success: true });
            // })
            // .catch(err => {
            //     console.error(err);
            //     res.status(403).json({
            //     success: false
            // })
        });
});


export default router;