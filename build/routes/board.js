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

router.get('/:bno', function (req, res) {
    console.log('[retrivepost] ');
    console.log(req.params.bno);
    _post2.default.find({ board_no: req.params.bno }, '_id post_no author_id author_name title created', function (err, posts) {
        if (err) return res.status(500).json({ error: err });
        res.json(posts);
    });
});

exports.default = router;