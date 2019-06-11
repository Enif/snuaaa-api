import express from 'express';

import { retrieveDocument, retrieveDocuments, deleteDocument } from "../controllers/document.controller";
import { deleteContent } from "../controllers/content.controller";
import { checkLike } from "../controllers/contentLike.controller";

import { verifyTokenUseReq } from '../lib/token';

const router = express.Router();

router.get('/', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    retrieveDocuments()
    .then((docuInfo) => {
        res.json(docuInfo)
    })
    .catch((err) => {
        console.error(err);
        res.status(409).json({
            error: 'RETRIEVE DOCUMENT FAIL',
            code: 1
        });
    })
})

router.get('/:doc_id', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    verifyTokenUseReq(req)
    .then(decodedToken => {
        return Promise.all([retrieveDocument(req.params.doc_id), checkLike(decodedToken._id, req.params.doc_id)])
    })
    .then((infos) => {
        res.json({
            docuInfo: infos[0],
            likeInfo: infos[1]
        })
    })
    .catch((err) => {
        console.error(err);
        res.status(409).json({
            error: 'RETRIEVE DOCUMENT FAIL',
            code: 1
        });
    })
})


router.delete('/:doc_id', (req, res) => {
    console.log(`[DELETE] ${req.baseUrl + req.url}`);

    verifyTokenUseReq(req)
    .then(decodedToken => {
        return deleteDocument(req.params.doc_id)
    })
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
        res.status(409).json({
            error: 'RETRIEVE DOCUMENT FAIL',
            code: 1
        });
    })
})


router.get('/generation/:genNum', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    retrieveDocuments(req.params.genNum)
    .then((docuInfo) => {
        res.json(docuInfo)
    })
    .catch((err) => {
        console.error(err);
        res.status(409).json({
            error: 'RETRIEVE DOCUMENT FAIL',
            code: 1
        });
    })
})

router.get('/:docuId/download/:index', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    retrieveDocument(req.params.docuId)
    .then((docuInfo) => {
        let index = req.params.index;
        console.log('./upload' + docuInfo.file_path[index])
        res.download('./upload' + docuInfo.file_path[index])
    })
    .catch((err) => {
        console.error(err)
        res.status(409).json({
            error: 'DOWNLOAD DOCUMENT FAIL',
            code: 1
        });
    })

})

export default router;