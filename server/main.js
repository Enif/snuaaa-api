// [LOAD PACKAGES]
import express from 'express';
import api from './routes';
import cors from 'cors';
import path from 'path'
import Sequelize from 'sequelize'

require('dotenv').config();

var app         = express();
var bodyParser  = require('body-parser');

// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if(process.env.NODE_ENV == 'develop') {
    // for local test
    app.use(express.static(__dirname + '/../../snuaaa-react/build'));    
}
else {
    app.use(express.static(path.join(__dirname)));
}

// app.use(express.static(path.join(__dirname, 'build')));
// app.get('/*', function (req, res) {
//    res.sendFile(__dirname + '/../../snuaaa-react/build/index.html');
//  });

// [TODO] SET CORS OPTIONS AFTER PUBLISHING
app.use(cors())

// [CONFIGURE SERVER PORT]
var port = process.env.PORT || 8080;

// [RUN SERVER]
app.listen(port, () => console.log(`Server listening on port ${port}`));


// var sequelize = new Sequelize(process.env.POSTGRESQL_URI)
// sequelize.authenticate()
// .then(() =>
//     console.log("Connected to PostgreSQL server")
// )
// .catch((e) => {
//     console.log("Failed to connect to PostgreSQL server >> ", e)
// })

// [CONFIGURE ROUTER]
app.use('/api', api);