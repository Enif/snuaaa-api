import express from 'express';
import path from 'path';
const uuid4 = require('uuid4');
import uploadMiddleware from '../middlewares/upload';
import { verifyTokenMiddleware } from '../middlewares/auth';

import { retrieveExhibition } from '../controllers/exhibition.controller';
import { createExhibitPhoto, retrieveExhibitPhotosInExhibition } from '../controllers/exhibitPhoto.controller';
import { resizeForThumbnail } from '../lib/resize';
import { retrieveUserByUserUuid } from '../controllers/user.controller';

const router = express.Router();

router.get('/:exhibition_id', verifyTokenMiddleware, (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);
    retrieveExhibition(req.params.exhibition_id)
        .then((exhibitionInfo) => {
            res.json({
                exhibitionInfo: exhibitionInfo
            })
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({
                error: 'RETRIEVE EXHIBITION FAIL',
                code: 0
            });
        })
})

router.patch('/:exhibition_id', verifyTokenMiddleware, (req, res) => {
    console.log(`[PATCH] ${req.baseUrl + req.url}`);

})


router.delete('/:exhibition_id', verifyTokenMiddleware, (req, res) => {
    console.log(`[DELETE] ${req.baseUrl + req.url}`);

})


router.get('/:exhibition_id/exhibitPhotos', verifyTokenMiddleware, (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    retrieveExhibitPhotosInExhibition(req.params.exhibition_id)
        .then((exhibitPhotosInfo) => {
            res.json({
                exhibitPhotosInfo: exhibitPhotosInfo
            })
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({
                error: 'RETRIEVE EXHIBITION FAIL',
                code: 0
            });
        })
})

router.post('/:exhibition_id/exhibitPhoto',
    verifyTokenMiddleware,
    uploadMiddleware('EH').single('exhibitPhoto'),
    (req, res) => {
        console.log(`[POST] ${req.baseUrl + req.url}`);

        if (!req.file) {
            res.status(409).json({
                error: 'EXHIBITPHOTO IS NOT ATTACHED',
                code: 1
            });
        }

        else {
            let basename = path.basename(req.file.filename, path.extname(req.file.filename));
            resizeForThumbnail(req.file.path)
                .then(() => {
                    if(req.body.photographer) {
                        return retrieveUserByUserUuid(req.body.photographer)
                    }
                })
                .then((photographer) => {
                    console.log(photographer)
                    let data = {
                        content_uuid: uuid4(),
                        author_id: req.decodedToken._id,
                        board_id: req.body.board_id,
                        category_id: req.body.category_id,
                        title: req.body.title,
                        text: req.body.text,
                        type: 'EP',
                        exhibition_id: req.body.exhibition_id,
                        order: req.body.order,
                        photographer_id: photographer ? photographer.user_id : null,
                        photographer_alt: photographer ? null : req.body.photographer_alt,
                        file_path: `/exhibition/${req.body.exhibition_no}/${req.file.filename}`,
                        thumbnail_path: `/exhibition/${req.body.exhibition_no}/${basename}_thumb.jpeg`,
                        location: req.body.location,
                        camera: req.body.camera,
                        lens: req.body.lens,
                        exposure_time: req.body.exposure_time,
                        focal_length: req.body.focal_length,
                        f_stop: req.body.f_stop,
                        iso: req.body.iso,
                        date: req.body.date ? new Date(req.body.date) : null
                    }
                    return createExhibitPhoto(data)
                })
                .then(() => {
                    return res.json({ success: true });
                })
        }
    })


export default router;