import express from 'express';
import multer from 'multer';
import fs from 'fs';

import { createContent, updateContent, deleteContent } from '../controllers/content.controller';
import { retrieveAlbum } from '../controllers/album.controller';
import { retrievePhotosInAlbum, createPhoto } from '../controllers/photo.controller';
import { retrieveTagsOnBoard } from "../controllers/tag.controller";
import { createContentTag } from '../controllers/contentTag.controller';
import { retrieveCategoryByBoard } from '../controllers/category.controller';

import { verifyTokenUseReq } from '../lib/token';
import { resize } from '../lib/resize';

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

router.get('/:album_id', (req, res) => {
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

router.patch('/:album_id', (req, res) => {
    console.log(`[PATCH] ${req.baseUrl + req.url}`);

    verifyTokenUseReq(req)
        .then((decodedToken) => {
            return updateContent(req.params.album_id, req.body)
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

router.delete('/:album_id', (req, res) => {
    console.log(`[DELETE] ${req.baseUrl + req.url}`);
    verifyTokenUseReq(req)
        .then(decodedToken => {
            //     return deleteAlbum(req.params.album_id)
            // })
            // .then(() => {
            return deleteContent(req.params.album_id)
        })
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


router.get('/:album_id/photos', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    retrievePhotosInAlbum(req.params.album_id)
        .then((photos) => {
            res.json(photos)
        })
        .catch((err) => {
            console.error(err)
            res.status(409).json({
                error: 'RETRIEVE PHOTO FAIL',
                code: 1
            });
        })
})

router.post('/:album_id/photos', upload.array('uploadPhotos'), (req, res) => {
    console.log(`[POST] ${req.baseUrl + req.url}`);

    verifyTokenUseReq(req)
        .then(decodedToken => {

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
                            file_path: '/album/' + req.params.album_id + '/' + req.files[i].filename
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
                        file_path: '/album/' + req.params.album_id + '/' + req.files[0].filename
                    })
                }

                Promise.all(req.files.map((file) => {
                    return resize(file.path)
                }))
                    .then(() => {
                        return Promise.all(data.map((data) => {
                            return new Promise((resolve, reject) => {
                                createContent(decodedToken._id, data.board_id, data, 'PH')
                                    .then((content_id) => {
                                        if (data.tags.length > 0) {
                                            return Promise.all(data.tags.map(tag_id => createContentTag(content_id, tag_id)).concat(createPhoto(content_id, data)))
                                        }
                                        else {
                                            return createPhoto(content_id, data)
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
                        res.status(409).json({
                            error: 'CREATE PHOTO FAIL',
                            code: 1
                        });
                    })
            }
        })
        .catch(err => res.status(403).json({
            success: false,
            message: err.message
        }));
})


// router.get('/:album_id/photo/:path', (req, res) => {
//     console.log('[retrive Photo] ');
//     res.sendFile(req.params.album_id + '/' + req.params.path, {root: './upload/album'})
// })


export default router;