import express from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';

import { verifyTokenMiddleware } from '../middlewares/auth';
import { retrieveUser, retrieveUserById, updateLoginDate } from '../controllers/user.controller';
import { createStatsLogin } from '../controllers/statsLogin.controller';
import { createUser, checkDupId } from '../controllers/user.controller';
import { resize } from '../lib/resize';

import { createToken } from '../lib/token';

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

router.get('/check', verifyTokenMiddleware, (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    let user = {};

    retrieveUser(req.decodedToken._id)
    .then((userInfo) => {
        user = userInfo;
        return Promise.all([createStatsLogin(user.user_id), updateLoginDate(user.user_id)])
    })
    .then(() => {
        return createToken({
            _id: user.user_id,
            level: user.level,
            autoLogin: req.decodedToken.autoLogin
        })
    })
    .then((token) => {
        return res.status(200).json({
            success: true,
            user_id: user.user_id,
            level: user.level,
            profile_path: user.profile_path,
            nickname: user.nickname,
            autoLogin: req.decodedToken.autoLogin,
            token 
        });
    })
    .catch(err => {
        console.error(err)
        return res.status(403).json({
            success: false,
            message: 'Token is not valid.'
        });
    })
})

router.post('/login', (req, res) => {

    console.log(`[POST] ${req.baseUrl + req.url}`);

    if(typeof req.body.password !== "string") {
        return res.status(401).json({
            error: "LOGIN FAILED",
            code: 1
        });
    }

    let userInfo = {};

    retrieveUserById(req.body.id)
    .then((user) => {
        return new Promise((resolve, reject) => {
            if (!user) {
                reject('id is not correct');
            }
            else if (bcrypt.compareSync(req.body.password, user.password)) {
                userInfo = user;
                resolve();
            }
            else {
                reject('password is not correct');
            }
        })
    })
    .then(() => {
        return Promise.all([createStatsLogin(userInfo.user_id), updateLoginDate(userInfo.user_id)])
    })
    .then(() => {
        return createToken({
            _id: userInfo.user_id,
            level: userInfo.level,
            autoLogin: req.body.autoLogin ? true : false
        })
    })
    .then((token) => {
        return res.status(200)
        .cookie('token', token, {
            path: '/',
            // domain: 'localhost:3000'
            // httpOnly: true
        })
        .json({
            sucess: true,
            user_id: userInfo.user_id,
            level: userInfo.level,
            profile_path: userInfo.profile_path,
            nickname: userInfo.nickname,
            autoLogin: req.body.autoLogin ? true : false,
            token: token 
        })
    })
    .catch((err) => {
        console.error(err);
        return res.status(403).json({
            sucess: false,
            message: 'Login Info is not valid.' 
        })
    })
});

router.get('/login/guest', (req, res) => {

    createToken({
            _id: -1,
            level: 0,
            autoLogin: false
    })
    .then((token) => {
        return res.status(200)
        .cookie('token', token, {
            path: '/',
        })
        .json({
            sucess: true,
            user_id: -1,
            level: 0,
            profile_path: null,
            nickname: 'guest',
            autoLogin: false,
            token: token 
        })
    })
    .catch((err) => {
        console.error(err);
        return res.status(403).json({
            sucess: false,
            message: 'Login Info is not valid.' 
        })
    })
});


router.post('/signup', upload.single('profile'), (req, res) => {
    console.log(`[POST] ${req.baseUrl + req.url}`);

    let usernameRegex = /^[a-zA-Z0-9]+$/;

    if (!usernameRegex.test(req.body.id)) {
        return res.status(400).json({
            error: "BAD USERNAME",
            code: 1
        });
    }

    // CHECK PASS LENGTH
    if (req.body.password.length < 4 || typeof req.body.password !== "string") {
        return res.status(400).json({
            error: "BAD PASSWORD",
            code: 2
        });
    }

    if (req.body.password !== req.body.passwordCf) {
        return res.status(400).json({
            error: "BAD PASSWORD CONFIRM ",
            code: 3
        })
    }

    let nickname = '';

    if (req.body.aaaNum) {
        if ((/^[0-9]{2}[Aa]{3}-[0-9]{1,3}$/).test(req.body.aaaNum)) {
            // 00AAA-000
            nickname = req.body.aaaNum.substr(0, 2) + req.body.username;
        }
        else if ((/^[Aa]{3}[0-9]{2}-[0-9]{1,3}$/).test(req.body.aaaNum)) {
            // AAA00-000
            nickname = req.body.aaaNum.substr(3, 2) + req.body.username;
        }
        else {
            nickname = req.body.username;
            req.body.aaaNum = null;
        }
    }
    else {
        nickname = req.body.username;
        req.body.aaaNum = null;
    }

    let level = req.body.aaaNum ? 2 : 1;
    let profilePath;
    if (req.file) {
        profilePath = '/profile/' + req.file.filename;
        resize(req.file.path)
    }

    const userData = {
        id: req.body.id,
        password: bcrypt.hashSync(req.body.password, 8),
        username: req.body.username,
        nickname: nickname,
        aaa_no: req.body.aaaNum,
        col_no: req.body.schoolNum,
        major: req.body.major,
        email: req.body.email,
        mobile: req.body.mobile,
        introduction: req.body.introduction,
        profile_path: profilePath,
        level: level
    }

    createUser(userData)
        .then(() => {
            console.log('sign Up Success  ')
            return res.json({ success: true });
        })
        .catch((err) => {
            console.error(err);
            return res.status(400).json({
                error: "Internal Server ERROR",
                code: 9
            })
        })
});

router.post('/signup/dupcheck', (req, res) => {
    console.log(`[POST] ${req.baseUrl + req.url}`);
    checkDupId(req.body.check_id)
        .then(() => {
            return res.json({ success: true })
        })
        .catch(err => {
            console.error(err);
            return res.status(403).json({
                success: false
            });
        });
})

export default router;
