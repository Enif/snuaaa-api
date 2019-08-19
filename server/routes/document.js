import express from 'express';

import { verifyTokenMiddleware } from '../middlewares/auth';

import { retrieveDocumentCount, retrieveDocument, retrieveDocuments, deleteDocument } from "../controllers/document.controller";
import { updateContent, deleteContent } from '../controllers/content.controller';
import { checkLike } from "../controllers/contentLike.controller";

const router = express.Router();

router.get('/', verifyTokenMiddleware, (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    let offset = 0;
    let docCount = 0;
    const ROWNUM = 10;

    if (req.query.page > 0) {
        offset = ROWNUM * (req.query.page - 1);
    }

    retrieveDocumentCount(req.query.category, req.query.generation)
        .then((count) => {
            docCount = count;
            return retrieveDocuments(ROWNUM, offset, req.query.category, req.query.generation)
        })
        .then((docInfo) => {
            res.json({
                docCount: docCount,
                docInfo: docInfo
            })
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                error: 'internal server error',
                code: 0
            });
        })
})

router.get('/:doc_id', verifyTokenMiddleware, (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    Promise.all([retrieveDocument(req.params.doc_id), checkLike(req.decodedToken._id, req.params.doc_id)])
        .then((infos) => {
            res.json({
                docuInfo: infos[0],
                likeInfo: infos[1]
            })
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                error: 'internal server error',
                code: 0
            });
        })
})

router.patch('/:doc_id', verifyTokenMiddleware, (req, res) => {
    console.log(`[PATCH] ${req.baseUrl + req.url}`);

    updateContent(req.params.doc_id, req.body)
        .then(() => {
            return res.json({ success: true });
        })
        .catch((err) => {
            console.error(err)
            res.status(500).json({
                error: 'internal server error',
                code: 0
            });
        })
})



router.delete('/:doc_id', verifyTokenMiddleware, (req, res) => {
    console.log(`[DELETE] ${req.baseUrl + req.url}`);

    deleteDocument(req.params.doc_id)
        .then(() => {
            return deleteContent(req.params.doc_id)
        })
        .then(() => {
            res.json({
                success: true
            })
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                error: 'internal server error',
                code: 0
            });
        })
})

export default router;

// @deprecated
// router.get('/generation/:genNum', verifyTokenMiddleware, (req, res) => {
//     console.log(`[GET] ${req.baseUrl + req.url}`);

//     retrieveDocuments(req.params.genNum)
//         .then((docuInfo) => {
//             res.json(docuInfo)
//         })
//         .catch((err) => {
//             console.error(err);
//             res.status(409).json({
//                 error: 'RETRIEVE DOCUMENT FAIL',
//                 code: 1
//             });
//         })
// })

// @deprecated
// router.get('/:docuId/download/:index', (req, res) => {
//     console.log(`[GET] ${req.baseUrl + req.url}`);

//     retrieveDocument(req.params.docuId)
//     .then((docuInfo) => {
//         let index = req.params.index;
//         console.log('./upload' + docuInfo.file_path[index])
//         res.download('./upload' + docuInfo.file_path[index])
//     })
//     .catch((err) => {
//         console.error(err)
//         res.status(409).json({
//             error: 'DOWNLOAD DOCUMENT FAIL',
//             code: 1
//         });
//     })

// })
