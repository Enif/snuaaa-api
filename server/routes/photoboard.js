import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

import { verifyTokenMiddleware } from '../middlewares/auth';

import { createContent } from '../controllers/content.controller';
import { createAlbum, retrieveAlbumsInBoard, retrieveAlbumCount } from '../controllers/album.controller';
import { createPhoto, retrievePhotoCountInBoard, retrievePhotosInBoard, retrievePhotoCountByTag, retrievePhotosByTag } from '../controllers/photo.controller';
import { createContentTag } from '../controllers/contentTag.controller';

import { resizeForThumbnail } from '../lib/resize';

const router = express.Router();

const storage = multer.diskStorage({
    // destination: './upload/album/',
    destination: function (req, file, cb) {
        if (!(fs.existsSync('./upload/album/default'))) {
            fs.mkdirSync('./upload/album/default')
        }
        cb(null, './upload/album/default/')
    },
    filename(req, file, cb) {
        let timestamp = (new Date).valueOf()
        cb(null, timestamp + '_' + file.originalname);
    },
});

const upload = multer({ storage })

router.get('/:board_id/albums', verifyTokenMiddleware, (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    let offset = 0;
    let albumCount = 0;
    const ROWNUM = 12;

    if (req.query.page > 0) {
        offset = ROWNUM * (req.query.page - 1);
    }

    retrieveAlbumCount(req.params.board_id, req.query.category)
        .then((count) => {
            albumCount = count;
            return retrieveAlbumsInBoard(req.params.board_id, ROWNUM, offset, req.query.category)
        })
        .then((albumInfo) => {
            res.json({
                albumCount: albumCount,
                albumInfo: albumInfo
            })
        })
        .catch((err) => {
            console.error(err);
            res.status(409).json({
                error: 'RETRIEVE ALBUM FAIL',
                code: 1
            });
        })
})

router.get('/:board_id/photos', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    let offset = 0;
    let photoCount = 0;
    const tags = req.query.tags;
    const ROWNUM = 12;

    if (req.query.page > 0) {
        offset = ROWNUM * (req.query.page - 1);
    }

    if (tags) {
        retrievePhotoCountByTag(tags)
            .then((count) => {
                photoCount = count;
                return retrievePhotosByTag(tags, ROWNUM, offset)
            })
            .then((photoInfo) => {
                res.json({
                    photoCount: photoCount,
                    photoInfo: photoInfo
                })
            })
            .catch((err) => {
                console.error(err);
                res.status(409).json({
                    error: 'RETRIEVE ALBUM FAIL',
                    code: 1
                });
            })
    }
    else {
        retrievePhotoCountInBoard(req.params.board_id)
            .then((count) => {
                photoCount = count;
                return retrievePhotosInBoard(req.params.board_id, ROWNUM, offset)
            })
            .then((photoInfo) => {
                res.json({
                    photoCount: photoCount,
                    photoInfo: photoInfo
                })
            })
            .catch((err) => {
                res.status(409).json({
                    error: 'RETRIEVE PHOTO FAIL',
                    code: 1
                });
            })
    }
})


router.post('/:board_id/album', verifyTokenMiddleware, (req, res) => {
    console.log(`[POST] ${req.baseUrl + req.url}`);

    let user_id = req.decodedToken._id;
    createContent(user_id, req.params.board_id, req.body, 'AL')
        .then((content_id) => {
            return createAlbum(content_id, req.body)
        })
        .then(() => {
            res.json({ success: true })
        })
        .catch(err => {
            console.error(err);
            res.status(403).json({
                success: false
            })
        });
})

router.post('/:board_id/photos',
    verifyTokenMiddleware, upload.single('uploadPhoto'),
    (req, res) => {
        console.info(`[POST] ${req.baseUrl + req.url}`);

        try {
            if (!req.file) {
                res.status(409).json({
                    error: 'PHOTO IS NOT ATTACHED',
                    code: 1
                });
            }
            else {

                const photoInfo = JSON.parse(req.body.photoInfo)
                let basename = path.basename(req.file.filename, path.extname(req.file.filename));
                resizeForThumbnail(req.file.path)
                    .then(() => {
                        let photoData = {
                            ...photoInfo,
                            type: 'PH',
                            author_id: req.decodedToken._id,
                            date: req.body.date ? new Date(req.body.date) : null,
                            board_id: req.params.board_id,
                            file_path: '/album/default/' + req.file.filename,
                            thumbnail_path: `/album/default/${basename}_thumb.jpeg`
                        }
                        return createPhoto(photoData)
                    })
                    .then((content_id) => {
                        if (photoInfo.tags && photoInfo.tags.length > 0) {
                            return Promise.all(photoInfo.tags.map(tag_id => createContentTag(content_id, tag_id)))
                        }
                    })
                    .then(() => {
                        res.json({ success: true });
                    })
                    .catch((err) => {
                        console.log(err)
                        res.status(409).json({
                            error: 'CREATE PHOTO FAIL',
                            code: 1
                        });
                    })
            }
        }
        catch (err) {
            console.error(err)
            res.status(500).json({
                error: 'internal server error',
                code: 0
            });
        }
    })

export default router;