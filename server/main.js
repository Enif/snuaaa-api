// [LOAD PACKAGES]
import express from 'express';
import api from './routes';
import cors from 'cors';
import Sequelize from 'sequelize'

require('dotenv').config();

var app         = express();
var bodyParser  = require('body-parser');
// var mongoose    = require('mongoose');
// var pgp = require('pg-promise')(pgOption)

// var pgOption = {
//     schema : 'snuaaa',
//     connect : function(){ console.log('Successfully connected to PostgreSQL server')}
// }

// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// for local test
app.use('/', express.static(__dirname + '/../../snuaaa-react/build'));

// for heroku
// app.use('/', express.static(__dirname));


// [TODO] SET CORS OPTIONS AFTER PUBLISHING
app.use(cors())

// [CONFIGURE SERVER PORT]
var port = process.env.PORT || 8080;

// [RUN SERVER]
app.listen(port, () => console.log(`Server listening on port ${port}`));


// CONNECT TO POSTSQL SERVER
// var db = pgp(process.env.POSTGRESQL_URI)
// db.any('SELECT * FROM snuaaa."TB_ACCOUNT"')
// .then(function(data) {
//     console.log(data)
// })
// .catch(function() {
//     console.log('err')
// })

// var sequelize = new Sequelize(process.env.POSTGRESQL_URI)
// sequelize.authenticate()
// .then(() =>
//     console.log("Connected to PostgreSQL server")
// )
// .catch((e) => {
//     console.log("Failed to connect to PostgreSQL server >> ", e)
// })


// CONNECT TO MONGODB SERVER
// var db = mongoose.connection;
// db.on('error', console.error);
// db.once('open', function(){
//     // CONNECTED TO MONGODB SERVER
//     console.log("Connected to mongod server");
// });

// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
// .then(() => console.log('Successfully connected to mongodb'))
// .catch(e => console.error(e));

// [CONFIGURE ROUTER]
app.use('/api', api);