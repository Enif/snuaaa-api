import express from 'express';
import Post from '../models/post';
import { verifyToken } from '../lib/token';

const router = express.Router();

router.get('/retrieve', (req, res) => {
    console.log('[retrivepost] ' + JSON.stringify(req.body));
    Post.find({}, function(err, posts){
        if(err) return res.status(500).json({error: err});
        res.json(posts)
    })

})

router.post('/save', (req, res) => {

    console.log('[savepost] ' + JSON.stringify(req.body));

    const auth = req.headers.authorization.split(" ");
    let token;

    if(auth[0] === 'Bearer') {
        token = auth[1]
    }

    if (!token) {
        return res.status(403).json({
            success: false,
            message: 'Token does not exist.'
        });
    }

    verifyToken(token)
    .then(decodedToken => {
        console.log(`[savepost] ${JSON.stringify(decodedToken)}`)

        // CREATE POST
        let post = new Post({
            user_id: decodedToken.user_id,
            title: req.body.title,
            contents: req.body.contents
        });

        // SAVE IN THE DATABASE
        post.save( err => {
            if(err) throw err;
            return res.json({ success: true });
        });
    })
    .catch(err => res.status(403).json({
        success: false,
        message: err.message
    }));
});

export default router;