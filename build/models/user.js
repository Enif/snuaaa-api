'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    id: String,
    passWord: String
    /*     signup_date: { type: Date, default: Date.now } */
});

module.exports = mongoose.model('user', userSchema);