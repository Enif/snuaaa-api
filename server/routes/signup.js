import express from 'express';
// import Account from '../models/account';
import multer from 'multer'
//import { signUp } from '../controllers'
import { duplicateCheck, signUp } from '../controllers/account'
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
        // console.log('>>>>>>>>>>>>>>>>>>>>>>>')
        // console.log(JSON.stringify(req))
        cb(null, req.body.timestamp + "_" + file.originalname);
        // cb(new Error("Failed to make file name"), `${(new Date()).valueOf()}-${file.originalname}`);
    },
});

const upload = multer({storage})

router.post('/', upload.single('profile'), (req, res) => {
    // CHECK USERNAME FORMAT
    let usernameRegex = /^[a-z0-9]+$/;

    console.log('[signup] ' + JSON.stringify(req.body));
    console.log('[signup] ' + req.file);

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
        introduction: req.body.introduction
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

/*     // CHECK USER EXISTANCE
    Account.findOne({ id: req.body.id }, (err, exists) => {
        if (err) throw err;
        if(exists){
            return res.status(409).json({
                error: "ID EXISTS",
                code: 4
            });
        }

        let nickname = req.body.aaaNum.substring(0,2) + req.body.username;

        // CREATE ACCOUNT
        let account = new Account({
            id: req.body.id,
            password: req.body.password,
            passwordCf: req.body.passwordCf,
            username: req.body.username,
            nickname: nickname,
            aaaNum: req.body.aaaNum,
            schoolNum: req.body.schoolNum,
            major: req.body.major,
            email: req.body.email,
            mobile: req.body.mobile,
            introduction: req.body.introduction
        });

        account.password = account.generateHash(account.password);
        if(req.file){
            account.profilePath = '/profile/' + req.body.timestamp + "_" + req.file.originalname;
        }
        // SAVE IN THE DATABASE
        account.save( err => {
            if(err) throw err;
            return res.json({ success: true });
        });

    }); */
});

export default router;