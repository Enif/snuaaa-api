import express from 'express';
import { retrieveComments, createComment } from '../queries/comment';
import { verifyTokenUseReq } from '../lib/token';

const router = express.Router();

router.get('/:id/comment', (req, res) => {
    console.log('[retriveComments] parent id >>> ', req.params.id);
    retrieveComments(req.params.id)
    .then((comments) => {
        res.json(comments)
    })
    .catch((err) => {
        res.status(500).json({ error: err })
    })
})

router.post('/:id/comment', (req, res) => {

    console.log('[savecomment] ' + JSON.stringify(req.body));

    verifyTokenUseReq(req)
        .then(decodedToken => {
            createComment(decodedToken._id, req.params.id, req.body)  
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