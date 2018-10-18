'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config(); // [LOAD PACKAGES]


var app = (0, _express2.default)();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', _express2.default.static(__dirname + '/../../snuaaa-react/build'));

// [TODO] SET CORS OPTIONS AFTER PUBLISHING
app.use((0, _cors2.default)());

// [CONFIGURE SERVER PORT]
var port = process.env.PORT || 8080;

// [RUN SERVER]
app.listen(port, function () {
    return console.log('Server listening on port ' + port);
});

// [ CONFIGURE mongoose ]

// CONNECT TO MONGODB SERVER
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function () {
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }).then(function () {
    return console.log('Successfully connected to mongodb');
}).catch(function (e) {
    return console.error(e);
});

// [CONFIGURE ROUTER]
app.use('/api', _routes2.default);