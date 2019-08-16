// [LOAD PACKAGES]
import express from 'express';
import api from './routes';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { errorHandler } from './middlewares/errorHandler';
import logger from './middlewares/logger';

require('dotenv').config();

const app = express();


// [CONFIGURE APP TO USE bodyParser]
app.use(logger);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

if(process.env.NODE_ENV == 'develop') {
    // for local test
    app.use(cors())
    app.use(express.static(__dirname + '/../../snuaaa-react/build'));
    app.get('/page/*', function (req, res) {
        res.sendFile(path.join(__dirname, '/../../snuaaa-react/build/index.html'));
    });
}
else {
    // [TODO] SET CORS OPTIONS AFTER PUBLISHING
    var corsOptions = {
        origin: 'https://snuaaa.org',
        optionsSuccessStatus: 200
    }
    app.use(cors(corsOptions))
    app.use(express.static(path.join(__dirname, '/../build-react')));
    app.get('/page/*', function (req, res) {
        res.sendFile(path.join(__dirname, '/../build-react/index.html'));
    });
}

app.use('/static', express.static(__dirname + '/../upload'));



// [CONFIGURE SERVER PORT]
var port = process.env.PORT || 8080;

// [RUN SERVER]
app.listen(port, () => console.log(`Server listening on port ${port}`));

// [CONFIGURE ROUTER]
app.use('/api', api);
app.use(errorHandler);
