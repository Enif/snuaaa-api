'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _account = require('../models/account');

var _account2 = _interopRequireDefault(_account);

var _album = require('../models/album');

var _album2 = _interopRequireDefault(_album);

var _token = require('../lib/token');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/:pbNo', function (req, res) {
    console.log('[Retrieve Albums] ' + JSON.stringify(req.body));
    _album2.default.find({ board_no: req.params.pbNo }, '_id title', function (err, albums) {
        if (err) return res.status(500).json({ error: err });
        res.json(albums);
    });
});

router.post('/:pbNo', function (req, res) {
    console.log('[Create Album] ' + JSON.stringify(req.body));
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

            // CREATE POST
            var album = new _album2.default({
                author_id: decodedToken.user_id,
                author_name: author_name,
                board_no: req.params.pbNo,
                title: req.body.title
            });

            // SAVE IN THE DATABASE
            album.save(function (err) {
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