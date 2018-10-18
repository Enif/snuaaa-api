'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _account = require('../models/account');

var _account2 = _interopRequireDefault(_account);

var _post = require('../models/post');

var _post2 = _interopRequireDefault(_post);

var _token = require('../lib/token');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', function (req, res) {
    console.log('[retrivepost] ');
    _post2.default.find({}, '_id post_no author_id author_name title created', function (err, posts) {
        if (err) return res.status(500).json({ error: err });
        res.json(posts);
    });
});

router.get('/:id', function (req, res) {
    console.log('[retrivepost] ');
    console.log(req.params.id);
    _post2.default.findById(req.params.id, function (err, post) {
        if (err) return res.status(500).json({ error: err });
        res.json(post);
    });
});

router.post('/', function (req, res) {

    console.log('[savepost] ' + JSON.stringify(req.body));

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
        console.log('[savepost] ' + JSON.stringify(decodedToken));

        _account2.default.findById(decodedToken.user_id, function (err, accRes) {
            if (err) throw err;
            if (!accRes) {
                return res.status(409).json({
                    error: 'ID NOT EXISTS',
                    code: 1
                });
            }
            var author_name = accRes.username;

            var post_no = 0;
            _post2.default.findOne({}, null, { sort: { "post_no": -1 } }).exec(function (err, pRes) {
                if (err) throw err;
                //post 없을 경우 예외처리 추가 필요
                if (!accRes) post_no = 1;else {
                    post_no = pRes.post_no + 1;
                }

                // CREATE POST
                var post = new _post2.default({
                    post_no: post_no,
                    author_id: decodedToken.user_id,
                    author_name: author_name,
                    board_no: req.body.boardNo,
                    title: req.body.title,
                    contents: req.body.contents
                });

                // SAVE IN THE DATABASE
                post.save(function (err) {
                    if (err) throw err;
                    return res.json({ success: true });
                });
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