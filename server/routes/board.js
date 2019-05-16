import express from 'express';
import { verifyTokenUseReq } from '../lib/token';
import { retrieveBoardInfo } from '../queries/board';
import { retrieveCategories } from '../queries/category';
import { retrievePostCount, retrievePosts, createPost } from '../queries/post';
import { retrieveTagsOnBoard } from '../queries/tag';

const router = express.Router();


router.get('/:board_id', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);
    let resBoardInfo;
    let resCategoryInfo;
    retrieveBoardInfo(req.params.board_id)
    .then((boardInfo) => {
        resBoardInfo = boardInfo
        return retrieveCategories(req.params.board_id)
    })
    .then((categories) => {
        resCategoryInfo = categories;
        res.json({resBoardInfo, resCategoryInfo});
    })
    .catch((err) => {
        console.error(err);
        res.status(403).json({
            success: false,
            error: 'RETRIEVE POST FAIL',
            code: 1
        })
    })
})

router.get('/:board_id/posts', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    let offset = 0;
    let postCount = 0;
    const ROWNUM = 10;

    if(req.query.page > 0) {
        offset = ROWNUM * (req.query.page - 1);
    }

    retrievePostCount(req.params.board_id)
    .then((count) => {
        postCount = count;
        return retrievePosts(req.params.board_id, ROWNUM, offset)
    })
    .then((postInfo) => {
        res.json({
            postCount: postCount,
            postInfo: postInfo
        })
    })
    .catch((err) => {
        console.error(err);
        res.status(403).json({
            success: false,
            error: 'RETRIEVE POST FAIL',
            code: 1
        })
    })
})

router.get('/:board_id/tags', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    retrieveTagsOnBoard(req.params.board_id)
    .then((tags) => {
        res.json(tags)
    })
    .catch((err) => {
        console.error(err);
        res.status(403).json({
            success: false,
            error: 'RETRIEVE POST FAIL',
            code: 1
        })
    })
})


router.post('/:board_id/post', (req, res) => {
    console.log(`[POST] ${req.baseUrl + req.url}`);

    verifyTokenUseReq(req)
    .then(decodedToken => {
        return createPost(decodedToken._id, req.params.board_id, req.body)
    })
    .then(() => {
        res.json({ success: true })
    })
    .catch((err) => {
        console.error(err);
        res.status(403).json({
            success: false,
            error: 'RETRIEVE POST FAIL',
            code: 1
        })
    });
});

export default router;