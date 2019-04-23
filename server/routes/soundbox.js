import express from 'express';
import { retrieveSoundBox } from '../queries/post'

const router = express.Router();

router.get('/', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);
    retrieveSoundBox()
    .then((post) => {
        res.json(post)
    })
    .catch((err) => {
        res.status(500).json({error: err});
    })
})


export default router;