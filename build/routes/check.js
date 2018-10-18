'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

/*
    GET /api/auth/check
*/

router.get('/', function (req, res) {

    // read the token from header or url 
    var token = req.headers['x-access-token'] || req.query.token;

    // token does not exist
    if (!token) {
        return res.status(403).json({
            success: false,
            message: 'not logged in'
        });
    }

    // create a promise that decodes the token
    var p = new Promise(function (resolve, reject) {
        jwt.verify(token, req.app.get('jwt-secret'), function (err, decoded) {
            if (err) reject(err);
            resolve(decoded);
        });
    });

    // if token is valid, it will respond with its info
    var respond = function respond(token) {
        res.json({
            success: true,
            info: token
        });
    };

    // if it has failed to verify, it will return an error message
    var onError = function onError(error) {
        res.status(403).json({
            success: false,
            message: error.message
        });
    };

    // process the promise
    p.then(respond).catch(onError);
});

exports.default = router;