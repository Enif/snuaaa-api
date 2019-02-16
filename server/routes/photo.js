import express from 'express';
import { verifyToken } from '../lib/token';
import { retrievePhoto } from '../controllers/photo'

const router = express.Router();

router.get('/:pNo', (req, res) => {
    console.log('[retrivePhotoInfo] ');
    retrievePhoto(req.params.pNo)
    .then((photoInfo) => {
        res.json(photoInfo)
    })
    .catch((err) => {
        res.status(409).json({
            error: 'RETRIEVE PHOTO FAIL',
            code: 1
        });
    })
})

export default router;