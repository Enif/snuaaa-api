import express from 'express';
import Account from '../../models/account'
import Post from '../../models/post';
import { verifyToken } from '../../lib/token';

const router = express.Router();

router.get('/', (req, res) => {
    console.log('[retrivepost] ');
    Post.find({},'_id post_no author_id author_name title created', function(err, posts){
        if(err) return res.status(500).json({error: err});
        res.json(posts)
    })
})

router.get('/:bno', (req, res) => {
    console.log('[retrivepost] ');
    console.log(req.params.bno);
    Post.find({board_no: req.params.bno},'_id post_no author_id author_name title created',{sort: {"post_no":-1}}, function(err, posts){
        if(err) return res.status(500).json({error: err});
        res.json(posts)
    })
})

export default router;