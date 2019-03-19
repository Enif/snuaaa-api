
import express from 'express';
import { logIn } from '../controllers/user'
import { createToken } from '../lib/token';

const router = express.Router();

/*
    [TODO] MAKE SAMLE..
    ACCOUNT LOGIN: POST /api/login
    BODY SAMPLE: { "id": "test", "password": "test" }
    ERROR CODES:
        1: LOGIN FAILED
*/

router.post('/', (req, res) => {

    console.log('[login]');
    if(typeof req.body.password !== "string") {
        return res.status(401).json({
            error: "LOGIN FAILED",
            code: 1
        });
    }

    logIn({id: req.body.id, password:req.body.password})
    .then((_id) => {
        return createToken({
            _id: _id
        })
    })
    .then(token => res.json({ sucess: true, token }))
    .catch(err => res.status(403).json({ sucess: false, message: err }));
});

export default router;