import express from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';

import { verifyTokenMiddleware } from '../middlewares/auth';
import { retrieveBoard, retrieveBoardsCanAccess } from '../controllers/board.controller';
import { retrieveCategoryByBoard } from '../controllers/category.controller';
import { createContent } from '../controllers/content.controller';
import { retrievePostsInBoard, createPost } from '../controllers/post.controller';
import { retrieveTagsOnBoard } from '../controllers/tag.controller';
import { createDocument } from '../controllers/document.controller';
import { createAttachedFile } from '../controllers/attachedFile.controller';

import { verifyTokenUseReq } from '../lib/token';

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!(fs.existsSync('./upload/file'))) {
            fs.mkdirSync('./upload/file')
        }
        cb(null, './upload/file/')
    },
    filename(req, file, cb) {
        let timestamp = (new Date).valueOf()
        cb(null, timestamp + '_' + file.originalname);
    },
});

const upload = multer({ storage })

router.get('/', verifyTokenMiddleware, (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    retrieveBoardsCanAccess(req.decodedToken.level)
        .then((boardInfo) => {
            return res.json(boardInfo)
        })
        .catch((err) => {
            console.error(err);
            return res.status(403).json({
                success: false
            })
        })
})

router.get('/:board_id', verifyTokenMiddleware, (req, res, next) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);
    let resBoardInfo;
    let resCategoryInfo;
    retrieveBoard(req.params.board_id)
        .then((boardInfo) => {
            resBoardInfo = boardInfo;
            if (boardInfo.lv_read > req.decodedToken.level) {
                const err = {
                    status: 403,
                    code: 4001
                }
                next(err);
            }
            else {
                return retrieveCategoryByBoard(req.params.board_id)
            }
        })
        .then((categories) => {
            if (categories) {
                resCategoryInfo = categories;
                res.json({ resBoardInfo, resCategoryInfo });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                success: false,
                code: 499
            })
        })
})

router.get('/:board_id/posts', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    let offset = 0;
    let postCount = 0;
    const ROWNUM = 10;

    if (req.query.page > 0) {
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


router.post('/:board_id/post', upload.array('attachedFiles', 3), (req, res) => {
    console.log(`[POST] ${req.baseUrl + req.url}`);

    verifyTokenUseReq(req)
        .then(decodedToken => {
            return createContent(decodedToken._id, req.params.board_id, req.body, 'PO')
        })
        .then((content_id) => {
            if (req.files) {
                return Promise.all(req.files.map((file) => {
                    let file_type = ''
                    if (file.mimetype.includes('image/')) {
                        file_type = 'I'
                    }
                    else {
                        console.log(file.mimetype)
                    }
                    let data = {
                        original_name: file.originalname,
                        file_path: file.path,
                        file_type: file_type
                    }
                    return createAttachedFile(content_id, data)
                }).concat(createPost(content_id, req.body)))
            }
            else {
                return createPost(content_id, req.body)
            }
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


router.post('/:board_id/document', upload.array('uploadFiles', 3), verifyTokenMiddleware, (req, res) => {
    console.log(`[POST] ${req.baseUrl + req.url}`);

    if (!req.files) {
        res.status(409).json({
            error: 'FILE IS NOT ATTACHED',
            code: 1
        });
    }
    else {
        let user_id = req.decodedToken._id;
        let file_path = new Array();
        req.files.forEach(file => {
            file_path.push('/file/' + file.filename)
        });
        req.body.file_path = file_path

        createContent(user_id, req.params.board_id, req.body, 'DO')
            .then((content_id) => {
                return Promise.all(req.files.map((file) => {
                    let file_type = ''
                    let extention = path.extname(file.path).substr(1);
                    if (['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG'].includes(extention)) {
                        file_type = 'IMG';
                    }
                    else if (['doc', 'DOC', 'docx', 'DOCX'].includes(extention)) {
                        file_type = 'DOC';
                    }
                    else if (['xls', 'XLS', 'xlsx', 'XLSX'].includes(extention)) {
                        file_type = 'XLS';
                    }
                    else if (['ppt', 'PPT', 'pptx', 'PPTX'].includes(extention)) {
                        file_type = 'PPT';
                    }
                    else if (['pdf', 'PPT'].includes(extention)) {
                        file_type = 'PDF';                        
                    }
                    else if (['hwp', 'HWP'].includes(extention)) {
                        file_type = 'HWP';
                    }
                    else if (['zip', 'ZIP'].includes(extention)) {
                        file_type = 'ZIP';
                    }
                    else {
                        file_type = 'N';
                        console.error(extention)
                    }
                    let data = {
                        original_name: file.originalname,
                        file_path: file.path,
                        file_type: file_type
                    }
                    return createAttachedFile(content_id, data)
                }).concat(createDocument(content_id, req.body)))
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