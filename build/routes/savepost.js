'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _post = require('../models/post');

var _post2 = _interopRequireDefault(_post);

var _token = require('../lib/token');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/retrieve', function (req, res) {
    console.log('[retrivepost] ' + JSON.stringify(req.body));
    _post2.default.find({}, function (err, posts) {
        if (err) return res.status(500).json({ error: err });
        res.json(posts);
    });
});

router.post('/save', function (req, res) {

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

        // CREATE POST
        var post = new _post2.default({
            user_id: decodedToken.user_id,
            title: req.body.title,
            contents: req.body.contents
        });

        // SAVE IN THE DATABASE
        post.save(function (err) {
            if (err) throw err;
            return res.json({ success: true });
        });
    }).catch(function (err) {
        return res.status(403).json({
            success: false,
            message: err.message
        });
    });
});

exports.default = router;