'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _signup = require('./signup');

var _signup2 = _interopRequireDefault(_signup);

var _login = require('./login');

var _login2 = _interopRequireDefault(_login);

var _userinfo = require('./userinfo');

var _userinfo2 = _interopRequireDefault(_userinfo);

var _check = require('./check');

var _check2 = _interopRequireDefault(_check);

var _board = require('./board');

var _board2 = _interopRequireDefault(_board);

var _photoboard = require('./photoboard');

var _photoboard2 = _interopRequireDefault(_photoboard);

var _post = require('./post');

var _post2 = _interopRequireDefault(_post);

var _album = require('./album');

var _album2 = _interopRequireDefault(_album);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.use('/signup', _signup2.default);
router.use('/login', _login2.default);
router.use('/userinfo', _userinfo2.default);
router.use('/check', _check2.default);
router.use('/board', _board2.default);
router.use('/photoboard', _photoboard2.default);
router.use('/post', _post2.default);
router.use('/album', _album2.default);

exports.default = router;