import express from 'express';
import { verifyTokenUseReq } from '../../lib/token';
import { retrievePosts } from '../../controllers/post'

const router = express.Router();


router.get('/:bno', (req, res) => {
    console.log('[retrivepost] bno > ', req.params.bno);
    
    retrievePosts(req.params.bno)
    .then((posts) => {
        console.log(posts)
        res.json(posts)
    })
    .catch((err) => {
        console.log(err)
        res.status(500).json({error: err})
    })
})

export default router;