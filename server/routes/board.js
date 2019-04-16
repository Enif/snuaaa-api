import express from 'express';
import { verifyTokenUseReq } from '../lib/token';
import { retrieveBoardInfo } from '../queries/board';
import { retrieveCategories } from '../queries/category';
import { retrievePosts, createPost } from '../queries/post';
import { retrieveTags } from '../queries/tag';

const router = express.Router();


router.get('/:bno', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);
    let resBoardInfo;
    let resCategoryInfo;
    retrieveBoardInfo(req.params.bno)
    .then((boardInfo) => {
        resBoardInfo = boardInfo
        return retrieveCategories(req.params.bno)
    })
    .then((categories) => {
        resCategoryInfo = categories;
        res.json({resBoardInfo, resCategoryInfo});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({error: err})
    })
    // retrievePosts(req.params.bno)
    // .then((posts) => {
    //     console.log(posts)
    //     res.json(posts)
    // })
    // .catch((err) => {
    //     console.log(err)
    //     res.status(500).json({error: err})
    // })
})

router.get('/:bno/posts', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    retrievePosts(req.params.bno)
    .then((posts) => {
        res.json(posts)
    })
    .catch((err) => {
        console.log(err)
        res.status(500).json({error: err})
    })
})

router.get('/:bno/tags', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    retrieveTags()
    .then((tags) => {
        console.log(tags)
        res.json(tags)
    })
    .catch((err) => {
        console.log(err)
        res.status(500).json({error: err})
    })
})


router.post('/:bno/post', (req, res) => {
    console.log(`[POST] ${req.baseUrl + req.url}`);

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