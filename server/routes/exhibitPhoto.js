import express from 'express';
import { verifyTokenMiddleware } from '../middlewares/auth';

import { retrieveExhibitPhoto, updateExhibitPhoto, deleteExhibitPhoto, retrieveExhibitPhotosInExhibition } from '../controllers/exhibitPhoto.controller';
import { checkLike } from '../controllers/contentLike.controller';
import { increaseViewNum, updateContent, deleteContent } from '../controllers/content.controller';

const router = express.Router();

router.get('/:exhibitPhoto_id', verifyTokenMiddleware, (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    try {
        let exhibitPhotoInfo = {};
        retrieveExhibitPhoto(req.params.exhibitPhoto_id)
            .then((info) => {
                exhibitPhotoInfo = info;
                return Promise.all([
                    checkLike(req.params.exhibitPhoto_id, req.decodedToken._id),
                    retrieveExhibitPhotosInExhibition(exhibitPhotoInfo.exhibitPhoto.exhibition_id),
                    increaseViewNum(req.params.exhibitPhoto_id)
                ])
            })
            .then((infos) => {
                res.json({
                    exhibitPhotoInfo: exhibitPhotoInfo,
                    likeInfo: infos[0],
                    exhibitPhotosInfo: infos[1]
                })
            })
            .catch((err) => {
                console.error(err)
            })
    }
    catch (err) {
        console.error(err)
    }

})

router.patch('/:exhibitPhoto_id', verifyTokenMiddleware, (req, res) => {
    console.log(`[PATCH] ${req.baseUrl + req.url}`);
    try {
        Promise.all([
            updateContent(req.params.exhibitPhoto_id, req.body),
            updateExhibitPhoto(req.params.exhibitPhoto_id, req.body)
        ])
            .then(() => {
                res.json({
                    success: true
                })
            })
            .catch((err) => {
                console.error(err)
            })
    }
    catch (err) {
        console.error(err)
    }

})


router.delete('/:exhibitPhoto_id', verifyTokenMiddleware, (req, res) => {
    console.log(`[DELETE] ${req.baseUrl + req.url}`);
    try {
        deleteExhibitPhoto(req.params.exhibitPhoto_id)
            .then(() => {
                return deleteContent(req.params.exhibitPhoto_id)
            })
            .then(() => {
                res.json({
                    success: true
                })
            })
            .catch((err) => {
                console.error(err)
            })
    }
    catch (err) {
        console.error(err)
    }

})




export default router;