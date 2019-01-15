import express from 'express';
import Account from '../models/account'
import Album from '../models/album';
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

    // Album.find({board_no: req.params.pbNo}, '_id title', function(err, albums){
    //     if(err) return res.status(500).json({error: err});
    //     res.json(albums) 
    // })
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

        // Account.findById( decodedToken.user_id, (err, accRes) => {
        //     if(err) throw err;
        //     if(!accRes) {
        //         return res.status(409).json({
        //             error: 'ID NOT EXISTS',
        //             code: 1
        //         });
        //     }
        //     let author_name = accRes.username;

        //     // CREATE POST
        //     let album = new Album({
        //         author_id: decodedToken.user_id,
        //         author_name: author_name,
        //         board_no: req.params.pbNo,
        //         title: req.body.title
        //     });

        //     // SAVE IN THE DATABASE
        //     album.save( err => {
        //         if(err) throw err;
        //         return res.json({ success: true });
        //     });
            
        // })
    })
    .catch(err => res.status(403).json({
        success: false,
        message: err.message
    }));

})




export default router;