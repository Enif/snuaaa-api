import express from 'express';
import { verifyToken } from '../lib/token';

const router = express.Router();

/*
    GET /api/check
*/

router.get('/', (req, res) => {
    console.log('[check]');

    const auth = req.headers.authorization.split(" ");
    let token;

    if(auth[0] === 'Bearer') {
        token = auth[1]
    }

    if (!token) {
        return res.status(403).json({
            success: false,
            message: 'Token does not exist.'
        });
    }

    verifyToken(token)
    .then(decodedToken => {
        console.log('[check] Token is valid..')
        return res.status(200).json({
            success: true
        });
    })
    .catch(err => {
        console.log('[check] Token is invalid..')
        return res.status(403).json({
            success: false,
            message: 'Token does not valid.'
        });
    })
})

export default router;

// router.get('/', (req, res) => {

//     // read the token from header or url 
//     const token = req.headers['x-access-token'] || req.query.token

//     // token does not exist
//     if(!token) {
//         return res.status(403).json({
//             success: false,
//             message: 'not logged in'
//         })
//     }

//     // create a promise that decodes the token
//     const p = new Promise(
//         (resolve, reject) => {
//             jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
//                 if(err) reject(err)
//                 resolve(decoded)
//             })
//         }
//     )

//     // if token is valid, it will respond with its info
//     const respond = (token) => {
//         res.json({
//             success: true,
//             info: token
//         })
//     }

//     // if it has failed to verify, it will return an error message
//     const onError = (error) => {
//         res.status(403).json({
//             success: false,
//             message: error.message
//         })
//     }

//     // process the promise
//     p.then(respond).catch(onError)

// })