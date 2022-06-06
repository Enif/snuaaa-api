"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// [LOAD PACKAGES]
const express = require("express");
const routes_1 = require("./routes");
const cors_1 = require("cors");
const cookie_parser_1 = require("cookie-parser");
const bodyParser = require("body-parser");
const errorHandler_1 = require("./middlewares/errorHandler");
const logger_1 = require("./middlewares/logger");
const helmet_1 = require("helmet");
require('dotenv').config();
const app = express();
// [CONFIGURE APP TO USE bodyParser]
app.use(helmet_1.default());
app.use(logger_1.default);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookie_parser_1.default());
if (process.env.NODE_ENV == 'develop') {
    // for local test
    app.use(cors_1.default());
}
else {
    const corsOptions = {
        origin: ['https://www.snuaaa.net', 'https://our.snuaaa.net'],
        optionsSuccessStatus: 200
    };
    app.use(cors_1.default(corsOptions));
}
app.use('/static', express.static(__dirname + '/../upload'));
// [CONFIGURE SERVER PORT]
const port = process.env.PORT || 8080;
// [RUN SERVER]
app.listen(port, () => console.log(`Server listening on port ${port}`));
// [CONFIGURE ROUTER]
app.use('/api', routes_1.default);
app.use(errorHandler_1.errorHandler);
//# sourceMappingURL=main.js.map