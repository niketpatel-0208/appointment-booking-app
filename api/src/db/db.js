// api/src/db/db.js
const knex = require('knex');
const config = require('../../knexfile');

// We are using the 'development' environment configuration from knexfile.js
const db = knex(config.development);

module.exports = db;
