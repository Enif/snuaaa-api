import express from 'express';
import fs from 'fs';
import multer from 'multer';

import { retrieveBoard } from '../controllers/board.controller';
import { retrieveCategoryByBoard } from '../controllers/category.controller';
import { createContent } from '../controllers/content.controller';
import { retrievePostsInBoard, createPost } from '../controllers/post.controller';
import { retrieveTagsOnBoard } from '../controllers/tag.controller';
import { createDocument } from '../controllers/document.controller';

import { verifyTokenUseReq } from '../lib/token';

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
    retrieveBoard(req.params.board_id)
    .then((boardInfo) => {
        resBoardInfo = boardInfo
        return retrieveCategoryByBoard(req.params.board_id)
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

    // retrievePostCount(req.params.board_id)
    // .then((count) => {
    //     postCount = count;
    //     return retrievePosts(req.params.board_id, ROWNUM, offset)
    // })
    // .then((postInfo) => {
    //     res.json({
    //         postCount: postCount,
    //         postInfo: postInfo
    //     })
    // })
    retrievePostsInBoard(req.params.board_id, ROWNUM, offset)
    .then((postInfo) => {
        res.json({
            postCount: postInfo.count,
            postInfo: postInfo.rows
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
        return createContent(decodedToken._id, req.params.board_id, req.body, 'PO')
    })
    .then((content_id) => {
        return createPost(content_id, req.body)
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

    // let user_id = '';

    // verifyTokenUseReq(req)
    // .then(decodedToken => {
    //     user_id = decodedToken._id;
    //     return createObject(user_id, req.params.board_id, req.body, 'PO')
    // })
    // .then((object_id) => {
    //     return createPost(object_id, user_id, req.body)
    // })
    // .then(() => {
    //     res.json({ success: true })
    // })
    // .catch((err) => {
    //     console.error(err);
    //     res.status(403).json({
    //         success: false,
    //         error: 'RETRIEVE POST FAIL',
    //         code: 1
    //     })
    // });
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
            return createContent(user_id, req.params.board_id, req.body, 'DO')
        })
        .then((content_id) => {
            return createDocument(content_id, req.body)
        })
        .then(() => {
            return res.json({ success: true })
        })
        .catch((err) => {
            console.error(err);
            return res.status(403).json({
                success: false,
                error: 'RETRIEVE POST FAIL',
                code: 1
            })
        });
    }
})

export default router;