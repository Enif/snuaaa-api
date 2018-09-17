import express from 'express';
import Account from '../models/account'
//import Album from '../models/album';
import Photo from '../models/photo';
import multer from 'multer'
import { verifyToken } from '../lib/token';

const router = express.Router();

const storage = multer.diskStorage({
    destination: './upload/album/',
    filename(req, file, cb) {
        cb(null, req.body.title + "-" + file.originalname);
        //cb(null, `${(new Date()).toDateString()}-${file.originalname}`);
    },
});

const upload = multer({storage})

router.get('/:aNo', (req, res) => {
    console.log('[retrivePhotos] ');
    Photo.find({},'_id author_id author_name title created', function(err, posts){
        if(err) return res.status(500).json({error: err});
        res.json(posts)
    })
})

router.post('/:aNo', upload.single('uploadPhoto'), (req, res) => {
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

        Account.findById( decodedToken.user_id, (err, accRes) => {
            if(err) throw err;
            if(!accRes) {
                return res.status(409).json({
                    error: 'ID NOT EXISTS',
                    code: 1
                });
            }
            let author_name = accRes.username;

            // CREATE Photo
            let photo = new Photo({
                author_id: decodedToken.user_id,
                author_name: author_name,
                album_no: req.body.albumNo,
                title: req.body.title
            });

            photo.path = '/upload/album'

            // SAVE IN THE DATABASE
            photo.save( err => {
                if(err) throw err;
                return res.json({ success: true });
            });
            
        })
    })
    .catch(err => res.status(403).json({
        success: false,
        message: err.message
    }));

})
export default router;