import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

import { verifyTokenMiddleware } from '../middlewares/auth';
import uploadMiddleware from '../middlewares/upload';

import { createContent, updateContent, deleteContent } from '../controllers/content.controller';
import { retrieveAlbum, updateAlbum, updateAlbumThumbnail } from '../controllers/album.controller';
import { retrievePhotosInAlbum, createPhoto } from '../controllers/photo.controller';
import { retrieveTagsOnBoard } from "../controllers/tag.controller";
import { createContentTag } from '../controllers/contentTag.controller';
import { retrieveCategoryByBoard } from '../controllers/category.controller';

import { resizeForThumbnail } from '../lib/resize';

const router = express.Router();

const storage = multer.diskStorage({
    // destination: './upload/album/',
    destination: function (req, file, cb) {
        if (!(fs.existsSync('./upload/album/' + req.params.album_id))) {
            fs.mkdirSync('./upload/album/' + req.params.album_id)
        }
        cb(null, './upload/album/' + req.params.album_id + '/')
    },
    filename(req, file, cb) {
        let timestamp = (new Date).valueOf()
        cb(null, timestamp + '_' + file.originalname);
    },
});

const upload = multer({ storage })

router.get('/:album_id', verifyTokenMiddleware, (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    try {

        let albumInfo = {};
        retrieveAlbum(req.params.album_id)
            .then((info) => {
                albumInfo = info;
                return Promise.all([
                    retrieveCategoryByBoard(albumInfo.board_id),
                    retrieveTagsOnBoard(albumInfo.board_id)
                ])
            })
            .then((infos) => {
                res.json({
                    albumInfo: albumInfo,
                    categoryInfo: infos[0],
                    tagInfo: infos[1]
                })
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({
                    error: 'internal server error',
                    code: 0
                })
            })
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'internal server error',
            code: 0
        })
    }
})

router.patch('/:album_id', verifyTokenMiddleware, (req, res) => {
    console.log(`[PATCH] ${req.baseUrl + req.url}`);

    updateContent(req.params.album_id, req.body)
        .then(() => {
            return updateAlbum(req.params.album_id, req.body)
        })
        .then(() => {
            res.json({
                success: true
            })
        })
        .catch((err) => {
            console.error(err);
            res.status(409).json({
                error: 'UPDATE ALBUM FAIL',
                code: 1
            });
        })
})

router.patch('/:album_id/thumbnail', verifyTokenMiddleware, (req, res) => {
    console.log(`[PATCH] ${req.baseUrl + req.url}`);

    let tn_photo_id = req.body.tn_photo_id;
    updateAlbumThumbnail(req.params.album_id, tn_photo_id)
        .then(() => {
            res.json({
                success: true
            })
        })
        .catch((err) => {
            console.error(err);
            res.status(409).json({
                error: 'UPDATE ALBUM FAIL',
                code: 1
            });
        })
})

router.delete('/:album_id', verifyTokenMiddleware, (req, res) => {
    console.log(`[DELETE] ${req.baseUrl + req.url}`);

    deleteContent(req.params.album_id)
        .then(() => {
            return res.json({ success: true });
        })
        .catch((err) => {
            console.error(err)
            res.status(500).json({
                error: 'DELETE ALBUM FAIL',
                code: 1
            })
        })
})


router.get('/:album_id/photos', verifyTokenMiddleware, (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    retrievePhotosInAlbum(req.params.album_id)
        .then((photos) => {
            res.json(photos)
        })
        .catch((err) => {
            console.error(err)
            res.status(500).json({
                error: 'internal server error',
                code: 0
            });
        })
})

router.post('/:album_id/photos',
    verifyTokenMiddleware,
    uploadMiddleware('PH').single('uploadPhoto'),
    (req, res) => {
        console.log(`[POST] ${req.baseUrl + req.url}`);

        try {
            if (!req.file) {
                res.status(409).json({
                    error: 'PHOTO IS NOT ATTACHED',
                    code: 1
                });
            }
            else if (!req.body.photoInfo) {
                res.status(409).json({
                    error: 'PHOTO DATA IS NOT ATTACHED',
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
                            date: photoInfo.date ? new Date(photoInfo.date) : null,
                            album_id: req.params.album_id,
                            file_path: `/album/${req.params.album_id}/${req.file.filename}`,
                            thumbnail_path: `/album/${req.params.album_id}/${basename}_thumb.jpeg`
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
                        console.error(err)
                        res.status(500).json({
                            error: 'internal server error',
                            code: 0
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