import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { verifyTokenUseReq } from '../lib/token';
import { resize } from '../lib/resize';
import { retrieveAlbum } from '../queries/album';
import { retrievePhotosInAlbum, createPhotoInAlbum } from '../queries/photo';
import { retrieveTagsOnBoardForObject } from '../queries/tag';

const router = express.Router();

const storage = multer.diskStorage({
    // destination: './upload/album/',
    destination: function(req, file, cb) {
        if(!(fs.existsSync('./upload/album/' + req.params.aNo))) {
            fs.mkdirSync('./upload/album/' + req.params.aNo)
        }
        cb(null, './upload/album/' + req.params.aNo + '/')
    },
    filename(req, file, cb) {
        let timestamp = (new Date).valueOf()
        cb(null, timestamp + '_' + file.originalname);
    },
});

const upload = multer({storage})

router.get('/:aNo', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    Promise.all([
        retrieveAlbum(req.params.aNo),
        retrieveTagsOnBoardForObject(req.params.aNo)
    ])
    .then((infos) => {
        res.json({
            albumInfo: infos[0],
            tagInfo: infos[1]
        })
    })
    .catch((err) => {
        res.status(409).json({
            error: 'RETRIEVE ALBUM FAIL',
            code: 1
        });
    })
})

router.get('/:aNo/photos', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    retrievePhotosInAlbum(req.params.aNo)
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

router.post('/:aNo/photos', upload.array('uploadPhotos'), (req, res) => {
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
            if(req.files.length > 1) {
                for(let i = 0; i < req.files.length; i++) {
                    let tags;
                    if(req.body.tags[i]) {
                        tags = req.body.tags[i].split(',')
                    }
                    else {
                        tags = [];
                    }
                    data.push({
                        type: 'PH',
                        board_id: req.body.board_id[i],
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
                        tags: tags,
                        album_id: req.params.aNo,
                        photoPath: '/album/' + req.params.aNo + '/' + req.files[i].filename
                    })
                }    
            }
            else {
                let tags;
                if(req.body.tags) {
                    tags = req.body.tags.split(',')
                }
                else {
                    tags = [];
                }
                data.push({
                    type: 'PH',
                    board_id: req.body.board_id,
                    title: req.body.title,
                    contents: req.body.desc,
                    date: req.body.date,
                    location: req.body.location,
                    camera: req.body.camera,
                    lens: req.body.lens,
                    focal_length: req.body.focal_length,
                    f_stop: req.body.f_stop,
                    exposure_time: req.body.exposure_time,
                    iso: req.body.iso,
                    tags: tags,
                    album_id: req.params.aNo,
                    photoPath: '/album/' + req.params.aNo + '/' + req.files[0].filename
                })
            }

            Promise.all(req.files.map((file) => {
                return resize(file.path)
            }))
            .then(() => {
                console.log('resize finished..')
                return Promise.all(data.map((data) => {
                    return createPhotoInAlbum(decodedToken._id, data)
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


// router.get('/:aNo/photo/:path', (req, res) => {
//     console.log('[retrive Photo] ');
//     res.sendFile(req.params.aNo + '/' + req.params.path, {root: './upload/album'})
// })


export default router;