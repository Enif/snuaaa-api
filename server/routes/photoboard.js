import express from 'express';
import { retrieveAlbums, createAlbum } from '../controllers/album';
import { verifyTokenUseReq } from '../lib/token';

const router = express.Router();

router.get('/:pbNo', (req, res) => {
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

router.post('/:pbNo/album', (req, res) => {
    console.log('[Create Album] ' + JSON.stringify(req.body));

    verifyTokenUseReq(req)
    .then(decodedToken => {

        createAlbum(decodedToken._id, req.params.pbNo, req.body)
        .then(() => {
            res.json({ success: true })
        })
        .catch((err) => {
            res.status(409).json({
                error: 'CREATE ALBUM FAIL',
                code: 1
            });
        })
    })
    .catch(err => res.status(403).json({
        success: false,
        message: err.message
    }));

})

export default router;