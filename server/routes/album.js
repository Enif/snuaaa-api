import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

import { verifyTokenMiddleware } from '../middlewares/auth';

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

    let albumInfo = {};
    retrieveAlbum(req.params.album_id)
        .then((info) => {
            albumInfo = info;
            return Promise.all([
                retrieveCategoryByBoard(albumInfo.content.board_id),
                retrieveTagsOnBoard(albumInfo.content.board_id)
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
            return res.status(409).json({
                error: 'RETRIEVE ALBUM FAIL',
                code: 1
            });
        })
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

router.post('/:album_id/photos', verifyTokenMiddleware, upload.array('uploadPhotos'), (req, res) => {
    console.log(`[POST] ${req.baseUrl + req.url}`);


    if (!req.files) {
        res.status(409).json({
            error: 'PHOTO IS NOT ATTACHED',
            code: 1
        });
    }
    else {
        const data = [];
        if (req.files.length > 1) {
            for (let i = 0; i < req.files.length; i++) {
                let tags;
                if (req.body.tags[i]) {
                    tags = req.body.tags[i].split(',')
                }
                else {
                    tags = [];
                }
                let basename = path.basename(req.files[i].filename, path.extname(req.files[i].filename));
                data.push({
                    type: 'PH',
                    board_id: req.body.board_id[i],
                    title: req.body.title[i],
                    text: req.body.text[i],
                    date: req.body.date[i] ? new Date(req.body.date[i]) : null,
                    location: req.body.location[i],
                    camera: req.body.camera[i],
                    lens: req.body.lens[i],
                    focal_length: req.body.focal_length[i],
                    f_stop: req.body.f_stop[i],
                    exposure_time: req.body.exposure_time[i],
                    iso: req.body.iso[i],
                    tags: tags,
                    album_id: req.params.album_id,
                    file_path: `/album/${req.params.album_id}/${req.files[i].filename}`,
                    thumbnail_path: `/album/${req.params.album_id}/${basename}_thumb.jpeg`
                })
            }
        }
        else {
            let tags;
            if (req.body.tags) {
                tags = req.body.tags.split(',')
            }
            else {
                tags = [];
            }
            let basename = path.basename(req.files[0].filename, path.extname(req.files[0].filename));
            data.push({
                type: 'PH',
                board_id: req.body.board_id,
                title: req.body.title,
                text: req.body.text,
                date: req.body.date ? new Date(req.body.date) : null,
                location: req.body.location,
                camera: req.body.camera,
                lens: req.body.lens,
                focal_length: req.body.focal_length,
                f_stop: req.body.f_stop,
                exposure_time: req.body.exposure_time,
                iso: req.body.iso,
                tags: tags,
                album_id: req.params.album_id,
                file_path: `/album/${req.params.album_id}/${req.files[0].filename}`,
                thumbnail_path: `/album/${req.params.album_id}/${basename}_thumb.jpeg`
            })
        }

        Promise.all(req.files.map((file) => {
            return resizeForThumbnail(file.path)
        }))
            .then(() => {
                return Promise.all(data.map((data) => {
                    return new Promise((resolve, reject) => {
                        let photoData = {
                            ...data,
                            author_id: req.decodedToken._id
                        }
                        createPhoto(photoData)
                            .then((content_id) => {
                                if (data.tags.length > 0) {
                                    return Promise.all(data.tags.map(tag_id => createContentTag(content_id, tag_id)))
                                }
                            })
                            .then(() => {
                                resolve()
                            })
                            .catch((err) => {
                                reject(err)
                            })
                    })
                }))
            })
            .then(() => {
                res.json({ success: true });
            })
            .catch((err) => {
                // throw err;
                console.log(err)
                res.status(500).json({
                    error: 'internal server error',
                    code: 0
                });
            })
    }
})



export default router;