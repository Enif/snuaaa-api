'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _account = require('../models/account');

var _account2 = _interopRequireDefault(_account);

var _token = require('../lib/token');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', function (req, res) {

    var auth = req.headers.authorization.split(" ");
    var token = void 0;
    if (auth[0] === 'Bearer') {
        token = auth[1];
    }
    //    const token = req.body.token || req.query.token || req.headers.authorization;
    console.log('[userinfo] ' + token);
    if (!token) {
        return res.status(403).json({
            success: false,
            message: 'Token does not exist.'
        });
    }

    (0, _token.verifyToken)(token).then(function (decodedToken) {
        console.log('[userinfo] ' + JSON.stringify(decodedToken));
        _account2.default.findById(decodedToken.user_id, function (err, accRes) {

            if (err) throw err;
            if (!accRes) {
                return res.status(409).json({
                    error: 'ID NOT EXISTS',
                    code: 1
                });
            }
            console.log('[userinfo] ' + JSON.stringify(accRes));

            var account = {
                id: accRes.id,
                username: accRes.username,
                aaaNum: accRes.aaaNum,
                schoolNum: accRes.schoolNum,
                major: accRes.major,
                email: accRes.email,
                mobile: accRes.mobile,
                introduction: accRes.introduction
            };

            return res.json({ success: true, account: account });
        });
    }).catch(function (err) {
        return res.status(403).json({
            success: false,
            message: err.message
        });
    });
});

router.get('/profile', function (req, res) {
    var auth = req.headers.authorization.split(" ");
    var token = void 0;

    if (auth[0] === 'Bearer') {
        token = auth[1];
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

            // [TODO] 이미지 파일 직접 보내고 받는법 고민...
            if (accRes.profilePath) {
                console.log('[userinfo]' + accRes.profilePath);

                _fs2.default.readFile(_path2.default.resolve(_path2.default.join(__dirname, '../..', accRes.profilePath)), function (err, data) {
                    if (err) throw err;
                    var extention = _path2.default.extname(_path2.default.join(__dirname, '../..', accRes.profilePath));
                    var base64Img = new Buffer(data, 'binary').toString('base64');

                    var imgString = 'data:image/' + extention.split('.').pop() + ';base64,' + base64Img;
                    return res.send(imgString);
                });
                // res.writeHead(200, {
                //     'Content-Type': 'image/png'
                // })

                //return res.sendFile(path.resolve(path.join(__dirname, '../..', accRes.profilePath)));
            }
        });
    }).catch(function (err) {
        return res.status(403).json({
            success: false,
            message: err.message
        });
    });
});

exports.default = router;