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
    app.use(cors())

    app.use(express.static(__dirname + '/../../snuaaa-react/build'));

    app.get('/login', function (req, res) {
        res.sendFile(path.join(__dirname, '/../../snuaaa-react/build/index.html'));
    });
    app.get('/signup', function (req, res) {
        res.sendFile(path.join(__dirname, '/../../snuaaa-react/build/index.html'));
    });
}
else {
    // [TODO] SET CORS OPTIONS AFTER PUBLISHING
    var corsOptions = {
        origin: 'http://52.78.161.191:8080/',
        optionsSuccessStatus: 200
    }
    app.use(cors(corsOptions))
    app.use(express.static(path.join(__dirname, '/../build-react')));
    app.get('/login', function (req, res) {
        res.sendFile(path.join(__dirname, '/../build-react/index.html'));
    });
    app.get('/signup', function (req, res) {
        res.sendFile(path.join(__dirname, '/../build-react/index.html'));
    });
    app.get('/about/*', function (req, res) {
        res.sendFile(path.join(__dirname, '/../build-react/index.html'));
    });
    app.get('/board/*', function (req, res) {
        res.sendFile(path.join(__dirname, '/../build-react/index.html'));
    });
    app.get('/photoboard/*', function (req, res) {
        res.sendFile(path.join(__dirname, '/../build-react/index.html'));
    });
    app.get('/album/*', function (req, res) {
        res.sendFile(path.join(__dirname, '/../build-react/index.html'));
    });
    app.get('/photo/*', function (req, res) {
        res.sendFile(path.join(__dirname, '/../build-react/index.html'));
    });
}

app.use('/static', express.static(__dirname + '/../upload'));


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