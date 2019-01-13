import express from 'express';
import Account from '../../models/account'
import Post from '../../models/post';
import { createPost, retrievePost } from '../../controllers/post'

import { verifyTokenUseReq } from '../../lib/token';


const router = express.Router();

// router.get('/', (req, res) => {
//     console.log('[retrivepost] ');
//     Post.find({}, '_id post_no author_id author_name title created', function (err, posts) {
//         if (err) return res.status(500).json({ error: err });
//         res.json(posts)
//     })
// })

router.get('/:id', (req, res) => {
    console.log('[retrivepost] post id >>> ', req.params.id);
    // Post.findById(req.params.id, function (err, post) {
    //     if (err) return res.status(500).json({ error: err });
    //     res.json(post)
    // })
    retrievePost(req.params.id)
    .then((post) => {
        res.json(post)
    })
    .catch((err) => {
        res.status(500).json({ error: err })
    })
})

router.post('/', (req, res) => {

    console.log('[createPost] ' + JSON.stringify(req.body));

    verifyTokenUseReq(req)
        .then(decodedToken => {
            console.log(`[createPost] ${JSON.stringify(decodedToken)}`)

            createPost(decodedToken._id, req.body)
            .then(() => {
                res.json({ success: true })
            })
            .catch(() => {
                return res.status(409).json({
                    error: 'ID NOT EXISTS',
                    code: 1
                });
            })

/*             Account.findById(decodedToken.user_id, (err, accRes) => {
                if (err) throw err;
                if (!accRes) {
                    return res.status(409).json({
                        error: 'ID NOT EXISTS',
                        code: 1
                    });
                }
                let author_name = accRes.nickname;

                let post_no = 0;
                Post.findOne({}, null, { sort: { "post_no": -1 } }).exec((err, pRes) => {
                    if (err) throw err;
                    //post 없을 경우 예외처리 추가 필요
                    if (!accRes) post_no = 1;
                    else {
                        post_no = pRes.post_no + 1;
                    }

                    // CREATE POST
                    let post = new Post({
                        post_no: post_no,
                        author_id: decodedToken.user_id,
                        author_name: author_name,
                        board_no: req.body.boardNo,
                        title: req.body.title,
                        contents: req.body.contents
                    });

                    // SAVE IN THE DATABASE
                    post.save(err => {
                        if (err) throw err;
                        return res.json({ success: true });
                    });
                })
            }) */
        })
        .catch(err => res.status(403).json({
            success: false,
            message: err.message
        }));

});

router.post('/:id/comment/', (req, res) => {

    console.log('[savecomment] ' + JSON.stringify(req.body));

    verifyTokenUseReq(req)
        .then(decodedToken => {
            console.log(`[savecomment]`)

            Account.findById(decodedToken.user_id, (err, accRes) => {
                if (err) throw err;
                if (!accRes) {
                    return res.status(409).json({
                        error: 'ID NOT EXISTS',
                        code: 1
                    });
                }

                console.log(req.params.id)
                console.log(decodedToken.user_id)
                console.log(accRes.nickname)
                console.log(req.body.content)

                // Post.update()
                Post.update(
                    { _id: req.params.id },
                    {
                        $addToSet: {
                            comment: req.body.content
                            // {
                            //     author_id: decodedToken.user_id,
                            //     author_name: accRes.nickname,
                            //     contents: req.body.content
                            // }
                        }
                    }, {
                        upsert: true
                    }, (err, raw) => {
                        console.log(err)
                        console.log(raw)
                    })
            })
        })
        .catch(err => res.status(403).json({
            success: false,
            message: err.message
        }));
});

export default router;