import express from 'express';

import { retrievePhoto, updatePhoto, deletePhoto } from '../controllers/photo.controller';
import { checkLike } from '../controllers/contentLike.controller';
import { updateContent, deleteContent } from '../controllers/content.controller';

import { verifyTokenUseReq } from '../lib/token';

const router = express.Router();

router.get('/:photo_id', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    verifyTokenUseReq(req)
    .then(decodedToken => {
        return Promise.all([
            retrievePhoto(req.params.photo_id),
            checkLike(decodedToken._id, req.params.photo_id),
            // retrieveTagsOnObject(req.params.photo_id),
            // retrieveAlbumByPhoto(req.params.photo_id)
        ])
    })
    .then((infos) => {
        res.json({
            photoInfo: infos[0],
            likeInfo: infos[1],
            tagInfo: infos[2],
            // albumInfo: infos[3]
        })
    })
    .catch((err) => {
        console.error(err);
        res.status(409).json({
            error: 'RETRIEVE PHOTO FAIL',
            code: 1
        });
    })
})

router.patch('/:photo_id', (req, res) => {
    console.log(`[PATCH] ${req.baseUrl + req.url}`);

    const objectData = {
        title: req.body.title,
        text: req.body.text
    }
    const photoData = req.body;

    verifyTokenUseReq(req)
    .then(decodedToken => {
        return Promise.all([
            updateContent(req.params.photo_id, objectData),
            updatePhoto(req.params.photo_id, photoData)
        ])
    })
    .then(() => {
        res.json({
            success: true
        })
    })
    .catch((err) => {
        console.error(err);
        res.status(409).json({
            error: 'RETRIEVE PHOTO FAIL',
            code: 1
        });
    })
})

router.delete('/:photo_id', (req, res) => {
    console.log(`[DELETE] ${req.baseUrl + req.url}`);
    verifyTokenUseReq(req)
    .then(decodedToken => {
        return deletePhoto(req.params.photo_id)
    })
    .then(() => {
        return deleteContent(req.params.photo_id)
    })
    .then(() => {
        return res.json({ success: true });
    })
    .catch((err) => {
        console.error(err)
        res.status(500).json()
    })
})

export default router;