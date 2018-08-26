import express from 'express';
import Account from '../models/account'
import Post from '../models/post';
import { verifyToken } from '../lib/token';

const router = express.Router();

router.get('/', (req, res) => {
    console.log('[retrivepost] ');
    Post.find({},'_id author_id author_name title created', function(err, posts){
        if(err) return res.status(500).json({error: err});
        res.json(posts)
    })
})

router.get('/:id', (req, res) => {
    console.log('[retrivepost] ');
    console.log(req.param.id);
    Post.findById(req.param.id, function(err, post){
        if(err) return res.status(500).json({error: err});
        res.json(post)
    })
})

router.post('/', (req, res) => {

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

        Account.findById( decodedToken.user_id, (err, accRes) => {
            if(err) throw err;
            if(!accRes) {
                return res.status(409).json({
                    error: 'ID NOT EXISTS',
                    code: 1
                });
            }
            let author_name = accRes.username;

            // CREATE POST
            let post = new Post({
                author_id: decodedToken.user_id,
                author_name: author_name,
                title: req.body.title,
                contents: req.body.contents
            });

            // SAVE IN THE DATABASE
            post.save( err => {
                if(err) throw err;
                return res.json({ success: true });
            });
        })
    })
    .catch(err => res.status(403).json({
        success: false,
        message: err.message
    }));
});

export default router;