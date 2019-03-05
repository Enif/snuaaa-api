import express from 'express';
import { createPost, retrievePost } from '../controllers/post';
import { verifyTokenUseReq } from '../lib/token';

const router = express.Router();

router.get('/:id', (req, res) => {
    console.log('[retrivepost] post id >>> ', req.params.id);
    retrievePost(req.params.id)
    .then((post) => {
        res.json(post)
    })
    .catch((err) => {
        res.status(500).json({ error: err })
    })
})

router.post('/', (req, res) => {

    console.log('[createPost] ' + JSON.stringify(req.body));
    verifyTokenUseReq(req)
        .then(decodedToken => {
            console.log(`[createPost] ${JSON.stringify(decodedToken)}`)

            createPost(decodedToken._id, req.body)
            .then(() => {
                res.json({ success: true })
            })
            .catch(() => {
                return res.status(409).json({
                    error: 'ID NOT EXISTS',
                    code: 1
                });
            })
        })
        .catch(err => res.status(403).json({
            success: false,
            message: err.message
        }));

});


export default router;