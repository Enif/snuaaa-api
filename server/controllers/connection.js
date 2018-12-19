require('dotenv').config();
const options = {};
const pgp = require('pg-promise')(options);
const db = pgp(process.env.POSTGRESQL_URI); 

module.exports = db;