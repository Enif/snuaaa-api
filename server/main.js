// [LOAD PACKAGES]
import express from 'express';
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');

// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/../../snuaaa-react/build'));

// [CONFIGURE SERVER PORT]
var port = process.env.PORT || 8080;


// [RUN SERVER]
var server = app.listen(port, function(){
 console.log("Express server has started on port " + port)
});

// [ CONFIGURE mongoose ]

// CONNECT TO MONGODB SERVER
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

mongoose.connect('mongodb://snuaaa:snuaaa18@ds263740.mlab.com:63740/snuaaa_proto');

// DEFINE MODEL
var Book = require('./models/book');

// [CONFIGURE ROUTER]
var router = require('./routes')(app, Book);