// [LOAD PACKAGES]
import express from 'express';
import api from './routes'

require('dotenv').config();

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
app.listen(port, () => console.log(`Server listening on port ${port}`));


// [ CONFIGURE mongoose ]

// CONNECT TO MONGODB SERVER
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
.then(() => console.log('Successfully connected to mongodb'))
.catch(e => console.error(e));

// [CONFIGURE ROUTER]
app.use('/api', api);