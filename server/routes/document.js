import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { verifyTokenUseReq } from '../lib/token';
import { retrieveDocument, retrieveDocuments, retrieveDocumentsByGen, createDocument } from '../controllers/document'

const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        console.log('dest...')
        if(!(fs.existsSync('./upload/file'))) {
            fs.mkdirSync('./upload/file')
        }
        cb(null, './upload/file/')
    },
    filename(req, file, cb) {
        let timestamp = (new Date).valueOf()
        cb(null, timestamp + '_' + file.originalname);
    },
});

const upload = multer({storage})

router.get('/', (req, res) => {
    console.log('[retriveDocumentInfo] ');
    retrieveDocuments()
    .then((docuInfo) => {
        res.json(docuInfo)
    })
    .catch((err) => {
        res.status(409).json({
            error: 'RETRIEVE DOCUMENT FAIL',
            code: 1
        });
    })
})


router.post('/', upload.array('uploadFiles', 3), (req, res) => {
    console.log('[Create Document] ' + JSON.stringify(req.body));

    verifyTokenUseReq(req)
    .then(decodedToken => {

        if(!req.files) {
            res.status(409).json({
                error: 'FILE IS NOT ATTACHED',
                code: 1
            });
        }
        else {
            console.dir(req.files);
            let file_path = new Array();
            req.files.forEach(file => {
                file_path.push('/file/' + file.filename)
            });
            req.body.file_path = file_path
            createDocument(decodedToken._id, req.body )
            .then(() => {
                res.json({ success: true });
            })
            .catch((err) => {
                // throw err;
                console.log(err)
                res.status(409).json({
                    error: 'CREATE DOCU FAIL',
                    code: 1
                });
            })
        }
    })
    .catch(err => res.status(403).json({
        success: false,
        message: err.message
    }));
})

router.get('/generation/:genNum', (req, res) => {
    console.log('[retriveDocumentInfo] ');
    retrieveDocumentsByGen(req.params.genNum)
    .then((docuInfo) => {
        res.json(docuInfo)
    })
    .catch((err) => {
        res.status(409).json({
            error: 'RETRIEVE DOCUMENT FAIL',
            code: 1
        });
    })
})

router.get('/:docuId/download/:index', (req, res) => {
    console.log('[download File]')
    retrieveDocument(req.params.docuId)
    .then((docuInfo) => {
        console.log(docuInfo);
        let index = req.params.index;
        console.log('./upload' + docuInfo.file_path[index])
        res.download('./upload' + docuInfo.file_path[index])
    })
    .catch((err) => {
        console.error(err)
    })

})

export default router;