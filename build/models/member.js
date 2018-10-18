'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var memberSchema = new Schema({
    id: String,
    passWord: String
    /*     signup_date: { type: Date, default: Date.now } */
});

module.exports = mongoose.model('member', memberSchema);