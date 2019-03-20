import express from 'express';
import { retrievePost } from '../queries/post';
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

export default router;