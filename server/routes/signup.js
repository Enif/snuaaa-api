import express from 'express';
import multer from 'multer'
import { duplicateCheck, signUp } from '../controllers/user'
import { resize } from '../lib/resize';

const router = express.Router();

/*
    ACCOUNT SIGNUP: POST /api/account/signup
    BODY SAMPLE: { "id": "test", "password": "test" }
    ERROR CODES:
        1: BAD ID
        2: BAD PASSWORD
        3: ID EXISTS
*/

const storage = multer.diskStorage({
    destination: './upload/profile',
    filename(req, file, cb) {
        let timestamp = (new Date).valueOf()
        cb(null, timestamp + "_" + file.originalname);
        // cb(new Error("Failed to make file name"), `${(new Date()).valueOf()}-${file.originalname}`);
    },
});

const upload = multer({storage})

router.post('/', upload.single('profile'), (req, res) => {
    // CHECK USERNAME FORMAT
    let usernameRegex = /^[a-zA-Z0-9]+$/;
    console.log('[signup]');

    if(!usernameRegex.test(req.body.id)) {
        return res.status(400).json({
            error: "BAD USERNAME",
            code: 1
        });
    }

    // CHECK PASS LENGTH
    if(req.body.password.length < 4 || typeof req.body.password !== "string") {
        return res.status(400).json({
            error: "BAD PASSWORD",
            code: 2
        });
    }

    if(req.body.password !== req.body.passwordCf) {
        return res.status(400).json({
            error: "BAD PASSWORD CONFIRM ",
            code: 3
        })
    }

    let profilePath;
    if(req.file){
        profilePath = '/profile/' + req.file.filename;
        resize(req.file.path)
    }

    let user = {
        id: req.body.id,
        password: req.body.password,
        username: req.body.username,
        // nickname: nickname,
        aaaNum: req.body.aaaNum,
        schoolNum: req.body.schoolNum,
        major: req.body.major,
        email: req.body.email,
        mobile: req.body.mobile,
        introduction: req.body.introduction,
        profile_path: profilePath
    }

    duplicateCheck(req.body.id)
    .then(() => signUp(user))
    .then(() => {
        console.log('sign Up Success  ')
        return res.json({ success: true });
    })
    .catch((err) => {
        console.log('sign Up Fail > ', err)
        return res.status(400).json({
            error: "Internal Server ERROR",
            code: 9
        })
    })
});

export default router;