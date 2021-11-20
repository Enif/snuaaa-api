// [LOAD PACKAGES]
import express from 'express';
import api from './routes';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { errorHandler } from './middlewares/errorHandler';
import logger from './middlewares/logger';
import helmet from 'helmet';

require('dotenv').config();

const app = express();


// [CONFIGURE APP TO USE bodyParser]
app.use(helmet());
app.use(logger);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

if (process.env.NODE_ENV == 'develop') {
    // for local test
    app.use(cors());
}
else {
    const corsOptions = {
        origin: ['https://www.snuaaa.net', 'https://community.snuaaa.net'],
        optionsSuccessStatus: 200
    }
    app.use(cors(corsOptions));
}

app.use('/static', express.static(__dirname + '/../upload'));

// [CONFIGURE SERVER PORT]
const port = process.env.PORT || 8080;

// [RUN SERVER]
app.listen(port, () => console.log(`Server listening on port ${port}`));

// [CONFIGURE ROUTER]
app.use('/api', api);
app.use(errorHandler);
