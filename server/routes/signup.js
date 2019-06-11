import express from 'express';
import multer from 'multer';

import { createUser, checkDupId } from '../controllers/user.controller';

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

    createUser(req)
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