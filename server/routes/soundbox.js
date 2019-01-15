import express from 'express';
import Post from '../models/post';
import { retrieveSoundBox } from '../controllers/post'

const router = express.Router();

router.get('/', (req, res) => {
    console.log('[retrive SoundBox] ');
    // Post.findOne({ board_no: "b00"},'_id post_no author_id author_name title created contents', {sort: { 'created_at': -1}}, function(err, posts){
    //     if(err) return res.status(500).json({error: err});
    //     res.json(posts)
    // })
    retrieveSoundBox()
    .then((post) => {
        res.json(post)
    })
    .catch((err) => {
        res.status(500).json({error: err});
    })
})


export default router;