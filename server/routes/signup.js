import express from 'express';
import multer from 'multer';
import bcrypt from 'bcryptjs';

import { createUser, checkDupId } from '../controllers/user.controller';
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

router.post('/', upload.single('profile'), (req, res) => {
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

router.post('/dupcheck', (req, res) => {
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