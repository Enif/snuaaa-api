import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { verifyToken } from '../lib/token';
import { resize } from '../lib/resize';
import { retrieveAlbum } from '../controllers/album'
import { retrievePhotos, createPhoto } from '../controllers/photo'

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
        cb(null, req.body.timestamp + '_' + file.originalname);
    },
});

const upload = multer({storage})

router.get('/:aNo', (req, res) => {
    console.log('[retriveAlbumInfo] ');
    retrieveAlbum(req.params.aNo)
    .then((albumInfo) => {
        res.json(albumInfo)
    })
    .catch((err) => {
        res.status(409).json({
            error: 'RETRIEVE ALBUM FAIL',
            code: 1
        });
    })
})

router.get('/:aNo/photos', (req, res) => {
    console.log('[retrivePhotos] ');
    retrievePhotos(req.params.aNo)
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

router.post('/:aNo/photo', upload.single('uploadPhoto'), (req, res) => {
    console.log('[Create Photo] ' + JSON.stringify(req.body));
    const auth = req.headers.authorization.split(" ");
    let token;

    if(auth[0] === 'Bearer') {
        token = auth[1]
    }

    if (!token) {
        return res.status(403).json({
            success: false,
            message: 'Token does not exist.'
        });
    }

    verifyToken(token)
    .then(decodedToken => {

        if(!req.file) {
            res.status(409).json({
                error: 'PHOTO IS NOT ATTACHED',
                code: 1
            });
        }
        else {
            console.dir(req.file);
            req.body.photoPath = '/album/' + req.body.albumNo + '/' + req.body.timestamp + '_' + req.file.originalname
            resize(req.file.path)
            .then(() => {
                createPhoto(decodedToken._id, req.body )
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