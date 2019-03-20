import express from 'express';
import { verifyTokenUseReq } from '../lib/token';
import { retrievePosts, createPost } from '../queries/post'

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


router.post('/:bno/post', (req, res) => {

    console.log('[createPost] ' + JSON.stringify(req.body));
    verifyTokenUseReq(req)
    .then(decodedToken => {
        return createPost(decodedToken._id, req.params.bno, req.body)
    })
    .then(() => {
        res.json({ success: true })
    })
    .catch(err => res.status(403).json({
        success: false,
        message: err.message
    }));
});

export default router;