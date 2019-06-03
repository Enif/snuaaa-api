import express from 'express';
import fs from 'fs';
import multer from 'multer';
import { verifyTokenUseReq } from '../lib/token';
import { retrieveBoardInfo } from '../queries/board';
import { createObject } from '../queries/object';
import { retrieveCategories } from '../queries/category';
import { retrievePostCount, retrievePosts, createPost } from '../queries/post';
import { createDocument } from '../queries/document';
import { retrieveTagsOnBoard } from '../queries/tag';

const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        if(!(fs.existsSync('./upload/file'))) {
            fs.mkdirSync('./upload/file')
        }
        cb(null, './upload/file/')
    },
    filename(req, file, cb) {
        let timestamp = (new Date).valueOf()
        cb(null, timestamp + '_' + file.originalname);
    },
});

const upload = multer({storage})

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


    let user_id = '';

    verifyTokenUseReq(req)
    .then(decodedToken => {
        user_id = decodedToken._id;
        return createObject(user_id, req.params.board_id, req.body, 'PO')
    })
    .then((object_id) => {
        return createPost(object_id, user_id, req.body)
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


router.post('/:board_id/document', upload.array('uploadFiles', 3), (req, res) => {
    console.log(`[POST] ${req.baseUrl + req.url}`);

    if(!req.files) {
        res.status(409).json({
            error: 'FILE IS NOT ATTACHED',
            code: 1
        });
    }
    else {
        let user_id = '';
        let file_path = new Array();
        req.files.forEach(file => {
            file_path.push('/file/' + file.filename)
        });
        req.body.file_path = file_path

        verifyTokenUseReq(req)
        .then(decodedToken => {
            user_id = decodedToken._id;
            return createObject(user_id, req.params.board_id, req.body, 'DO')
        })
        .then((object_id) => {
            return createDocument(object_id, user_id, req.body)
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
    }
})

export default router;