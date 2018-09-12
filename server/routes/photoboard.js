import express from 'express';
import Account from '../models/account'
import Album from '../models/album';
import { verifyToken } from '../lib/token';

const router = express.Router();

router.get('/:pbno', (req, res) => {
    console.log('[Retrieve Albums] ' + JSON.stringify(req.body));
    Album.find({}, '_id title', function(err, albums){
        if(err) return res.status(500).json({error: err});
        res.json(albums) 
    })
})

router.post('/:pbno', (req, res) => {
    console.log('[Create Album] ' + JSON.stringify(req.body));
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

            // CREATE POST
            let album = new Album({
                author_id: decodedToken.user_id,
                author_name: author_name,
                board_no: req.body.boardNo,
                title: req.body.title
            });

            // SAVE IN THE DATABASE
            album.save( err => {
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