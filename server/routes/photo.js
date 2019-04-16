import express from 'express';
import { verifyTokenUseReq } from '../lib/token';
import { checkLike } from '../queries/object';
import { retrievePhoto } from '../queries/photo';
import { retrieveTagsOnObject } from '../queries/tag';
const router = express.Router();

router.get('/:photo_id', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    verifyTokenUseReq(req)
    .then(decodedToken => {
        return Promise.all([
            retrievePhoto(req.params.photo_id),
            checkLike(decodedToken._id, req.params.photo_id),
            retrieveTagsOnObject(req.params.photo_id)        
        ])
    })
    .then((infos) => {
        console.log(infos)
        res.json({
            photoInfo: infos[0],
            likeInfo: infos[1],
            tagInfo: infos[2]
        })
    })
    .catch((err) => {
        res.status(409).json({
            error: 'RETRIEVE PHOTO FAIL',
            code: 1
        });
    })
})

export default router;