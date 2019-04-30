import express from 'express';
import { verifyTokenUseReq } from '../lib/token';
import { retrieveInfo, updateUser, dropUser } from '../queries/user';
import { retrievePostsByUser } from '../queries/post';
import { retrievePhotosByUser } from '../queries/photo';
import { retrieveCommentsByUser } from '../queries/comment';

const router = express.Router();

router.get('/', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    verifyTokenUseReq(req)
    .then((decodedToken) => {
        return retrieveInfo(decodedToken._id)
    })
    .then((userInfo) => {
        return res.json({success: true, userInfo})
    })
    .catch(err => res.status(403).json({
        success: false,
        message: err.message
    }));
})

router.patch('/', (req, res) => {
    console.log(`[PATCH] ${req.baseUrl + req.url}`);

    verifyTokenUseReq(req)
    .then((decodedToken) => {
        return updateUser(decodedToken._id, req.body)
    })
    .then(() => {
        return res.json({success: true})
    })
    .catch(err => res.status(403).json({
        success: false,
        message: err.message
    }));
})

router.delete('/', (req, res) => {
    console.log(`[DELETE] ${req.baseUrl + req.url}`);

    verifyTokenUseReq(req)
    .then((decodedToken) => {
        return dropUser(decodedToken._id)
    })
    .then(() => {
        return res.json({success: true})
    })
    .catch(err => res.status(403).json({
        success: false,
        message: err.message
    }));
})

router.get('/posts', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);
    verifyTokenUseReq(req)
    .then((decodedToken) => {
        const user_id = decodedToken._id;
        return Promise.all([retrievePostsByUser(user_id), retrievePhotosByUser(user_id), retrieveCommentsByUser(user_id)])
    })
    .then((infos) => {
        return res.json({
            success: true,
            postList: infos[0],
            photoList: infos[1],
            commentList: infos[2]
        })
    })
    // .catch((err)=> console.error(err));
    .catch(err => res.status(403).json({
        success: false,
        message: err.message
    }));
})

export default router;