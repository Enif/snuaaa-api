'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _account = require('../models/account');

var _account2 = _interopRequireDefault(_account);

var _photo = require('../models/photo');

var _photo2 = _interopRequireDefault(_photo);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _token = require('../lib/token');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import Album from '../models/album';
var router = _express2.default.Router();

var storage = _multer2.default.diskStorage({
    // destination: './upload/album/',
    destination: function destination(req, file, cb) {
        if (!_fs2.default.existsSync('./upload/album/' + req.params.aNo)) {
            _fs2.default.mkdirSync('./upload/album/' + req.params.aNo);
        }
        cb(null, './upload/album/' + req.params.aNo + '/');
    },
    filename: function filename(req, file, cb) {
        cb(null, req.body.title + "-" + file.originalname);
        //cb(null, `${(new Date()).toDateString()}-${file.originalname}`);
    }
});

var upload = (0, _multer2.default)({ storage: storage });

router.get('/:aNo', function (req, res) {
    console.log('[retrivePhotos] ');
    _photo2.default.find({ album_no: req.params.aNo }, '_id author_id author_name title created', function (err, posts) {
        if (err) return res.status(500).json({ error: err });
        res.json(posts);
    });
});

router.post('/:aNo', upload.single('uploadPhoto'), function (req, res) {
    console.log('[Create Photo] ' + JSON.stringify(req.body));
    var auth = req.headers.authorization.split(" ");
    var token = void 0;

    if (auth[0] === 'Bearer') {
        token = auth[1];
    }

    if (!token) {
        return res.status(403).json({
            success: false,
            message: 'Token does not exist.'
        });
    }

    (0, _token.verifyToken)(token).then(function (decodedToken) {

        _account2.default.findById(decodedToken.user_id, function (err, accRes) {
            if (err) throw err;
            if (!accRes) {
                return res.status(409).json({
                    error: 'ID NOT EXISTS',
                    code: 1
                });
            }
            var author_name = accRes.username;

            // CREATE Photo
            var photo = new _photo2.default({
                author_id: decodedToken.user_id,
                author_name: author_name,
                album_no: req.body.albumNo,
                title: req.body.title
            });

            photo.path = '/upload/album' + req.params.aNo + '/';

            // SAVE IN THE DATABASE
            photo.save(function (err) {
                if (err) throw err;
                return res.json({ success: true });
            });
        });
    }).catch(function (err) {
        return res.status(403).json({
            success: false,
            message: err.message
        });
    });
});
exports.default = router;