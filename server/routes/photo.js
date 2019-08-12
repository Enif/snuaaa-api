import express from 'express';

import { retrievePhoto, updatePhoto, deletePhoto, retrievePhotosInAlbum } from '../controllers/photo.controller';
import { checkLike } from '../controllers/contentLike.controller';
import { updateContent, deleteContent } from '../controllers/content.controller';
import { retrieveTagsOnBoard } from '../controllers/tag.controller';
import { retrieveTagsByContent, createContentTag, deleteContentTag } from '../controllers/contentTag.controller';

import { verifyTokenUseReq } from '../lib/token';

const router = express.Router();

router.get('/:photo_id', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    let photoInfo = {};
    let likeInfo = {};

    verifyTokenUseReq(req)
    .then(decodedToken => {
        return Promise.all([
            retrievePhoto(req.params.photo_id),
            checkLike(req.params.photo_id, decodedToken._id),
            // retrieveTagsOnObject(req.params.photo_id),
            // retrieveAlbumByPhoto(req.params.photo_id)
        ])
    })
    .then((infos) => {
        photoInfo = infos[0];
        likeInfo = infos[1];
        return Promise.all([
            retrieveTagsOnBoard(photoInfo.contentPhoto.board_id),
            retrievePhotosInAlbum(photoInfo.album.content_id)
        ]) 
    })
    .then((infos) => {
        res.json({
            photoInfo: photoInfo,
            likeInfo: likeInfo,
            boardTagInfo: infos[0],
            albumPhotosInfo: infos[1]
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
            retrieveTagsByContent(req.params.photo_id),
            updateContent(req.params.photo_id, objectData),
            updatePhoto(req.params.photo_id, photoData)
        ])
    })
    .then((infos) => {
        const prevTags = infos[0].map(tag => tag.tag_id);
        const newTags = photoData.tags;
        const updateTag = [];
                
        if (prevTags && prevTags.length > 0) {
            prevTags.forEach(tag => {
                if(!newTags.includes(tag)) {
                    updateTag.concat(deleteContentTag(req.params.photo_id, tag));
                }
            });
        }
        if (newTags && newTags.length > 0) {
            newTags.forEach(tag => {
                if(!prevTags.includes(tag)) {
                    updateTag.concat(createContentTag(req.params.photo_id, tag));
                }
            })
        }
        return Promise.all(updateTag)
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