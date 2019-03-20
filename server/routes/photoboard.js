import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { retrieveAlbums, createAlbum } from '../queries/album';
import { retrievePhotosInBoard, createPhotoInPhotoBoard } from '../queries/photo';
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
    console.log('[Retrieve Albums] >> ', req.params.pbNo);
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
})

router.get('/:pbNo/photos', (req, res) => {
    console.log('[Retrieve Albums] >> ', req.params.pbNo);
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
    console.log('[Create Album] ' + JSON.stringify(req.body));

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

router.post('/:pbNo/photo', upload.single('uploadPhoto'), (req, res) => {
    console.log('[Create Photo] ' + JSON.stringify(req.body));

    verifyTokenUseReq(req)
    .then(decodedToken => {

        if(!req.file) {
            res.status(409).json({
                error: 'PHOTO IS NOT ATTACHED',
                code: 1
            });
        }
        else {
            req.body.photoPath = '/album/default/' + req.file.filename
            resize(req.file.path)
            .then(() => {
                createPhotoInPhotoBoard(decodedToken._id, req.params.pbNo, req.body)
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