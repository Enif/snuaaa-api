import express from 'express';
import { verifyTokenMiddleware } from '../middlewares/auth';
import { deleteFile } from '../controllers/file.controller';

const router = express.Router();

router.delete('/:file_id', verifyTokenMiddleware, (req, res) => {
    console.log(`[DELETE] ${req.baseUrl + req.url}`);

    try {
        deleteFile(req.params.file_id)
            .then(() => {
                res.json({
                    success: true
                })
            })
            .catch((err) => {
                console.error(err)
                return res.status(500).json({
                    error: 'UPDATE FAIL',
                    code: 0
                });    
            })
    }
    catch (err) {
        console.error(err)
    }
})

export default router;