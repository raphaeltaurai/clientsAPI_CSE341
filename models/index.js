const dbConfig = require('../config/db.config.js');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.employee = require('./employee.js')(mongoose);
db.client = require('./client.js')(mongoose);

module.exports = db;