import express from 'express';

import { retrieveSoundBox, retrieveRecentPosts } from '../controllers/post.controller';
import { retrievePhotosInBoard } from '../controllers/photo.controller';
import { retrieveRecentComments } from '../controllers/comment.controller';

const router = express.Router();

router.get('/soundbox', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);
    retrieveSoundBox()
    .then((post) => {
        res.json(post)
    })
    .catch((err) => {
        console.error(err);
        res.status(401).json({
            error: 'Retrieve Soundbox fail'
        });
    })
})

router.get('/posts', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);
    retrieveRecentPosts()
    .then((posts) => {
        res.json(posts)
    })
    .catch((err) => {
        console.error(err);
        res.status(401).json({
            error: 'Retrieve Posts fail'
        });
    })
})

router.get('/memory', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);
    retrievePhotosInBoard('brd07', 9, 0)
    .then((photos) => {
        res.json(photos)
    })
    .catch((err) => {
        console.error(err);
        res.status(401).json({
            error: 'Retrieve Photos fail'
        });
    })
})

router.get('/astrophoto', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);
    retrievePhotosInBoard('brd08', 9, 0)
    .then((photos) => {
        res.json(photos)
    })
    .catch((err) => {
        console.error(err);
        res.status(401).json({
            error: 'Retrieve Photos fail'
        });
    })
})

router.get('/comments', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);
    retrieveRecentComments()
    .then((comments) => {
        res.json(comments)
    })
    .catch((err) => {
        console.error(err);
        res.status(401).json({
            error: 'Retrieve Comments fail'
        });
    })
})

export default router;