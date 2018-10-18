'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _account = require('../models/account');

var _account2 = _interopRequireDefault(_account);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

/*
    ACCOUNT SIGNUP: POST /api/account/signup
    BODY SAMPLE: { "id": "test", "password": "test" }
    ERROR CODES:
        1: BAD ID
        2: BAD PASSWORD
        3: ID EXISTS
*/

var storage = _multer2.default.diskStorage({
    destination: './upload/profile',
    filename: function filename(req, file, cb) {
        cb(null, req.body.id + "-" + file.originalname);
        //cb(null, `${(new Date()).toDateString()}-${file.originalname}`);
    }
});

var upload = (0, _multer2.default)({ storage: storage });

router.post('/', upload.single('profile'), function (req, res) {
    // CHECK USERNAME FORMAT
    var usernameRegex = /^[a-z0-9]+$/;

    console.log('[signup] ' + JSON.stringify(req.body));
    console.log('[signup] ' + req.file);

    if (!usernameRegex.test(req.body.id)) {
        return res.status(400).json({
            error: "BAD USERNAME",
            code: 1
        });
    }

    // CHECK PASS LENGTH
    if (req.body.password.length < 4 || typeof req.body.password !== "string") {
        return res.status(400).json({
            error: "BAD PASSWORD",
            code: 2
        });
    }

    // CHECK USER EXISTANCE
    _account2.default.findOne({ id: req.body.id }, function (err, exists) {
        if (err) throw err;
        if (exists) {
            return res.status(409).json({
                error: "ID EXISTS",
                code: 3
            });
        }

        var nickname = req.body.schoolNum + req.body.username;

        // CREATE ACCOUNT
        var account = new _account2.default({
            id: req.body.id,
            password: req.body.password,
            passwordCf: req.body.passwordCf,
            username: req.body.username,
            nickname: nickname,
            aaaNum: req.body.aaaNum,
            schoolNum: req.body.schoolNum,
            major: req.body.major,
            email: req.body.email,
            mobile: req.body.mobile,
            introduction: req.body.introduction
        });

        account.password = account.generateHash(account.password);
        account.profilePath = '/upload/profile/' + account.id + "-" + req.file.originalname;
        // SAVE IN THE DATABASE
        account.save(function (err) {
            if (err) throw err;
            return res.json({ success: true });
        });
    });
});

exports.default = router;