'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var Account = new Schema({
    id: String,
    password: String,
    passwordCf: String,
    username: String,
    aaaNum: String,
    schoolNum: String,
    major: String,
    email: String,
    mobile: String,
    introduction: String,
    profilePath: String,
    created: { type: Date, default: Date.now }
});

Account.methods.generateHash = function (password) {
    return _bcryptjs2.default.hashSync(password, 8);
};

Account.methods.validateHash = function (password) {
    return _bcryptjs2.default.compareSync(password, this.password);
};

Account.statics.findOneByUserid = function (id) {
    return this.findOne({ id: id });
};

exports.default = _mongoose2.default.model('account', Account);

/*** Schema TYPE ****
 * 
 * String
 * Number
 * Date
 * Buffer
 * Boolean
 * Mixed
 * Objectid
 * Array
 * 
 */