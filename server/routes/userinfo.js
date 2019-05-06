import express from 'express';
import multer from 'multer'
import { verifyTokenUseReq } from '../lib/token';
import { resize } from '../lib/resize';
import { retrieveInfo, updateUser, dropUser } from '../queries/user';
import { retrievePostsByUser } from '../queries/post';
import { retrievePhotosByUser } from '../queries/photo';
import { retrieveCommentsByUser } from '../queries/comment';

const router = express.Router();

const storage = multer.diskStorage({
    destination: './upload/profile',
    filename(req, file, cb) {
        let timestamp = (new Date).valueOf()
        cb(null, timestamp + "_" + file.originalname);
        // cb(new Error("Failed to make file name"), `${(new Date()).valueOf()}-${file.originalname}`);
    },
});

const upload = multer({storage})

router.get('/', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    verifyTokenUseReq(req)
    .then((decodedToken) => {
        return retrieveInfo(decodedToken._id)
    })
    .then((userInfo) => {
        return res.json({success: true, userInfo})
    })
    .catch((err)=> console.error(err));
    // .catch(err => res.status(403).json({
    //     success: false,
    //     message: err.message
    // }));
})

router.patch('/', upload.single('profileImg'), (req, res) => {
    console.log(`[PATCH] ${req.baseUrl + req.url}`);

    let profilePath;


    let user_id;


    verifyTokenUseReq(req)
    .then((decodedToken) => {
        user_id = decodedToken._id;
        if(req.file) {
            profilePath = '/profile/' + req.file.filename;
            return resize(req.file.path)
        }
    })
    .then(() => {
        return retrieveInfo(user_id)
    })
    .then((userInfo) => {
        let data = req.body;
        if(profilePath) {
            data.profile_path = profilePath
        }
        else {
            data.profile_path = userInfo.profile_path
        }

        let nickname = '';

        if(req.body.aaa_no) {
            if((/^[0-9]{2}[Aa]{3}-[0-9]{1,3}$/).test(req.body.aaa_no)) {
                // 00AAA-000
                nickname = req.body.aaa_no.substr(0,2) + req.body.name;
            }
            else if((/^[Aa]{3}[0-9]{2}-[0-9]{1,3}$/).test(req.body.aaa_no)) {
                // AAA00-000
                nickname = req.body.aaa_no.substr(3,2) + req.body.name;
            }
            else {
                nickname = data.name;
                data.aaa_no = null;
            }
        }

        let level;

        if(userInfo.level > 1) {
            level = userInfo.level;
        }
        else if(data.aaa_no) {
            level = 1;
        }
        else {
            level = 0;
        }

        let userData = {
            name: data.name,
            nickname: nickname,
            aaa_no: data.aaa_no,
            col_no: data.col_no,
            major: data.major,
            email: data.email,
            mobile: data.mobile,
            introduction: data.introduction,
            level: level,
            profile_path: data.profile_path
        }
    
        return updateUser(user_id, userData)
    })
    .then(() => {
        return res.json({success: true})
    })
    .catch((err) => {
        console.error(err)
        res.status(403).json({
            success: false
        })
    });
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