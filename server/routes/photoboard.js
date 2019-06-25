import express from 'express';
import multer from 'multer';
import fs from 'fs';

import { createContent } from '../controllers/content.controller';
import { createAlbum, retrieveAlbums, retrieveAlbumCount, retrieveAlbumsByCategory } from '../controllers/album.controller';
import { createPhoto, retrievePhotoCountInBoard, retrievePhotosInBoard, retrievePhotoCountByTag, retrievePhotosByTag } from '../controllers/photo.controller';
import { createContentTag } from '../controllers/contentTag.controller';

import { verifyTokenUseReq } from '../lib/token';
import { resize } from '../lib/resize';

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

router.get('/:board_id/albums', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    let offset = 0;
    let albumCount = 0;
    const ROWNUM = 12;

    if (req.query.page > 0) {
        offset = ROWNUM * (req.query.page - 1);
    }

    // retrieveAlbumCountByCategory(req.params.board_id, req.query.category)
    // .then((count) => {
    //     albumCount = count;
    //     return retrieveAlbumsByCategory(req.params.board_id, req.query.category, ROWNUM, offset)
    // })
    // .then((albumInfo) => {
    //     res.json({
    //         albumCount: albumCount,
    //         albumInfo: albumInfo
    //     })
    // })
    // .catch((err) => {
    //     console.error(err);
    //     res.status(409).json({
    //         error: 'RETRIEVE ALBUM FAIL',
    //         code: 1
    //     });
    // })

    if (req.query.category) {
        retrieveAlbumCount(req.params.board_id, req.query.category)
            .then((count) => {
                albumCount = count;
                return retrieveAlbumsByCategory(req.params.board_id, req.query.category, ROWNUM, offset)
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
    }
    else {
        retrieveAlbumCount(req.params.board_id)
            .then((count) => {
                albumCount = count;
                return retrieveAlbums(req.params.board_id, ROWNUM, offset)
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
    }
})

router.get('/:board_id/photos', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    let offset = 0;
    let photoCount = 0;
    const ROWNUM = 12;

    if (req.query.page > 0) {
        offset = ROWNUM * (req.query.page - 1);
    }

    if (req.query.tag) {
        retrievePhotoCountByTag(req.query.tag)
            .then((count) => {
                photoCount = count;
                return retrievePhotosByTag(req.query.tag, ROWNUM, offset)
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


router.post('/:board_id/album', (req, res) => {
    console.log(`[POST] ${req.baseUrl + req.url}`);

    let user_id = '';

    verifyTokenUseReq(req)
        .then(decodedToken => {
            user_id = decodedToken._id;
            return createContent(user_id, req.params.board_id, req.body, 'AL')
        })
        .then((content_id) => {
            return createAlbum(content_id)
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

router.post('/:board_id/photos', upload.array('uploadPhotos'), (req, res) => {
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
                            title: req.body.title[i],
                            text: req.body.text[i],
                            date: req.body.date[i] ? (new Date(req.body.date[i])) : null,
                            location: req.body.location[i],
                            camera: req.body.camera[i],
                            lens: req.body.lens[i],
                            focal_length: req.body.focal_length[i],
                            f_stop: req.body.f_stop[i],
                            exposure_time: req.body.exposure_time[i],
                            iso: req.body.iso[i],
                            tags: tags,
                            board_id: req.params.board_id,
                            file_path: '/album/default/' + req.files[i].filename
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
                        board_id: req.params.board_id,
                        file_path: '/album/default/' + req.files[0].filename
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
                        console.log(err)
                        res.status(409).json({
                            error: 'CREATE PHOTO FAIL',
                            code: 1
                        });
                    })
            }
        })
        .catch(err => {
            console.error(err);
            res.status(403).json({
                success: false,
            })
        });

})

export default router;