import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { retrieveAlbums, createAlbum, retrieveAlbumsbyCategory } from '../queries/album';
import { retrievePhotosInBoard, createPhotosInBoard } from '../queries/photo';
import { verifyTokenUseReq } from '../lib/token';
import { resize } from '../lib/resize';

const router = express.Router();

const storage = multer.diskStorage({
    // destination: './upload/album/',
    destination: function(req, file, cb) {
        if(!(fs.existsSync('./upload/album/default'))) {
            fs.mkdirSync('./upload/album/default')
        }
        cb(null, './upload/album/default/')
    },
    filename(req, file, cb) {
        let timestamp = (new Date).valueOf()
        cb(null, timestamp + '_' + file.originalname);
    },
});

const upload = multer({storage})

router.get('/:pbNo/albums', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    if(req.query.category) {
        retrieveAlbumsbyCategory(req.params.pbNo, req.query.category)
        .then((albums) => {
            res.json(albums)
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
        retrieveAlbums(req.params.pbNo)
        .then((albums) => {
            res.json(albums)
        })
        .catch((err) => {
            res.status(409).json({
                error: 'RETRIEVE ALBUM FAIL',
                code: 1
            });
        })
    }
})

router.get('/:pbNo/photos', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    retrievePhotosInBoard(req.params.pbNo)
    .then((photos) => {
        res.json(photos)
    })
    .catch((err) => {
        res.status(409).json({
            error: 'RETRIEVE PHOTO FAIL',
            code: 1
        });
    })
})


router.post('/:pbNo/album', (req, res) => {
    console.log(`[POST] ${req.baseUrl + req.url}`);

    verifyTokenUseReq(req)
    .then(decodedToken => {
        console.log('decoded success')
        return createAlbum(decodedToken._id, req.params.pbNo, req.body)
    })
    .then(() => {
        console.log('create success')
        res.json({ success: true })
    })
    .catch(err => res.status(403).json({
        success: false,
        message: err.message
    }));

})

router.post('/:pbNo/photos', upload.array('uploadPhotos'), (req, res) => {
    console.log(`[POST] ${req.baseUrl + req.url}`);

    verifyTokenUseReq(req)
    .then(decodedToken => {

        if(!req.files) {
            res.status(409).json({
                error: 'PHOTO IS NOT ATTACHED',
                code: 1
            });
        }
        else {
            const data = [];
            for(let i = 0; i < req.files.length; i++) {
                data.push({
                    type: 'PH',
                    title: req.body.title[i],
                    contents: req.body.desc[i],
                    date: req.body.date[i],
                    location: req.body.location[i],
                    camera: req.body.camera[i],
                    lens: req.body.lens[i],
                    focal_length: req.body.focal_length[i],
                    f_stop: req.body.f_stop[i],
                    exposure_time: req.body.exposure_time[i],
                    iso: req.body.iso[i],
                    board_id: req.params.pbNo,
                    photoPath: '/album/default/' + req.files[i].filename
                })
            }

            Promise.all(req.files.map((file) => {
                return resize(file.path)
            }))
            .then(() => {
                return Promise.all(data.map((data) => {
                    return createPhotosInBoard(decodedToken._id, data)
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

export default router;