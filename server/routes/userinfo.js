import express from 'express';
import multer from 'multer'
import bcrypt from 'bcryptjs';

import { verifyTokenMiddleware } from '../middlewares/auth';

import { retrievePostsByUser, retrievePostsByUserUuid } from '../controllers/post.controller';
import { retrievePhotosByUser, retrievePhotosByUserUuid } from '../controllers/photo.controller';
import { retrieveCommentsByUser, retrieveCommentsByUserUuid } from '../controllers/comment.controller';
import { retrieveUser, updateUser, deleteUser, retrieveUserPw, updateUserPw, retrieveUserByUserUuid } from '../controllers/user.controller';

import { resize } from '../lib/resize';

const router = express.Router();

const storage = multer.diskStorage({
    destination: './upload/profile',
    filename(req, file, cb) {
        let timestamp = (new Date).valueOf()
        cb(null, timestamp + "_" + file.originalname);
        // cb(new Error("Failed to make file name"), `${(new Date()).valueOf()}-${file.originalname}`);
    },
});

const upload = multer({ storage })

router.get('/', verifyTokenMiddleware, (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    retrieveUser(req.decodedToken._id)
        .then((userInfo) => {
            return res.json({ success: true, userInfo })
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                error: 'internal server error',
                code: 0
            });
        });
    // .catch(err => res.status(403).json({
    //     success: false,
    //     message: err.message
    // }));
})

router.patch('/', verifyTokenMiddleware, upload.single('profileImg'), (req, res) => {
    console.log(`[PATCH] ${req.baseUrl + req.url}`);

    let user_id = req.decodedToken._id;

    retrieveUser(user_id)
        .then((userInfo) => {
            let data = req.body;
            if (req.file) {
                data.profile_path = '/profile/' + req.file.filename;;
                resize(req.file.path);
            }
            else {
                data.profile_path = userInfo.profile_path;
            }

            let nickname = '';

            if (req.body.aaa_no) {
                if ((/^[0-9]{2}[Aa]{3}-[0-9]{1,3}$/).test(req.body.aaa_no)) {
                    // 00AAA-000
                    nickname = req.body.aaa_no.substr(0, 2) + req.body.username;
                }
                else if ((/^[Aa]{3}[0-9]{2}-[0-9]{1,3}$/).test(req.body.aaa_no)) {
                    // AAA00-000
                    nickname = req.body.aaa_no.substr(3, 2) + req.body.username;
                }
                else {
                    nickname = data.username;
                    data.aaa_no = null;
                }
            }
            else {
                nickname = data.username;
                data.aaa_no = null;
            }

            let level;

            if (userInfo.level > 1) {
                level = userInfo.level;
            }
            else if (data.aaa_no) {
                level = 2;
            }
            else {
                level = 1;
            }

            let userData = {
                username: data.username,
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
            return res.json({ success: true })
        })
        .catch((err) => {
            console.error(err)
            res.status(500).json({
                error: 'internal server error',
                code: 0
            });
        });
})

router.patch('/password', verifyTokenMiddleware, (req, res, next) => {
    console.log(`[PATCH] ${req.baseUrl + req.url}`);
    let user_id = req.decodedToken._id;
    let data = req.body;

    retrieveUserPw(user_id)
        .then((userInfo) => {
            return new Promise((resolve, reject) => {
                if (!bcrypt.compareSync(data.password, userInfo.password)) {
                    const err = {
                        status: 403,
                        code: 1011
                    }
                    reject(err);
                }
                else if (!data.newPassword) {
                    const err = {
                        status: 403,
                        code: 1012
                    }
                    reject(err);
                }
                else if (data.newPassword !== data.newPasswordCf) {
                    const err = {
                        status: 403,
                        code: 1013
                    }
                    reject(err);
                }
                else if (data.newPassword.length < 8 || data.newPassword.length > 20) {
                    const err = {
                        status: 403,
                        code: 1014
                    }
                    reject(err);
                }
                else {
                    updateUserPw(user_id, bcrypt.hashSync(data.newPassword, 10))
                    .then(() => resolve())
                    .catch((err) => reject(err))
                }    
            })
        })
        .then(() => {
            res.json({
                success: true
            })
        })
        .catch((err) => {
            console.error(err);
            if(err.status) {
                next(err);
            }
            else {
                const errCode = {
                    status: 500,
                    code: 1010
                }
                next(errCode);
            }
        })
})

router.delete('/', verifyTokenMiddleware, (req, res) => {
    console.log(`[DELETE] ${req.baseUrl + req.url}`);

    deleteUser(decodedToken._id)
        .then(() => {
            return res.json({ success: true })
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'internal server error',
                code: 0
            });
        });
})

router.get('/posts', verifyTokenMiddleware, (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    const user_id = req.decodedToken._id;
    retrievePostsByUser(user_id)
        .then((info) => {
            return res.json({
                success: true,
                postList: info
            })
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'internal server error',
                code: 0
            });
        });
})

router.get('/photos', verifyTokenMiddleware, (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    const user_id = req.decodedToken._id;
    retrievePhotosByUser(user_id)
        .then((info) => {
            return res.json({
                success: true,
                photoList: info,
            })
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'internal server error',
                code: 0
            });
        });
})


router.get('/comments', verifyTokenMiddleware, (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    const user_id = req.decodedToken._id;
    retrieveCommentsByUser(user_id)
        .then((info) => {
            return res.json({
                success: true,
                commentList: info
            })
        })
        // .catch((err)=> console.error(err));
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'internal server error',
                code: 0
            });
        });
})


router.get('/:user_uuid', verifyTokenMiddleware, (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    const user_uuid = req.params.user_uuid;
    retrieveUserByUserUuid(user_uuid)
        .then((userInfo) => {
            return res.json({ success: true, userInfo })
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                error: 'internal server error',
                code: 0
            });
        });
})

router.get('/:user_uuid/posts', verifyTokenMiddleware, (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    const user_uuid = req.params.user_uuid;
    retrievePostsByUserUuid(user_uuid)
        .then((info) => {
            return res.json({
                success: true,
                postList: info
            })
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'internal server error',
                code: 0
            });
        });
})

router.get('/:user_uuid/photos', verifyTokenMiddleware, (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    const user_uuid = req.params.user_uuid;
    retrievePhotosByUserUuid(user_uuid)
        .then((info) => {
            return res.json({
                success: true,
                photoList: info,
            })
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'internal server error',
                code: 0
            });
        });
})


router.get('/:user_uuid/comments', verifyTokenMiddleware, (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    const user_uuid = req.params.user_uuid;
    retrieveCommentsByUserUuid(user_uuid)
        .then((info) => {
            return res.json({
                success: true,
                commentList: info
            })
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'internal server error',
                code: 0
            });
        });
})


export default router;
