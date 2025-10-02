const dbConfig = require('../config/dbconfig.js');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

// Export Employee model (was a schema before)
const EmployeeSchema = require('./employee.js');
db.employee = mongoose.model('employee', EmployeeSchema);

// Export Client model
db.client = require('./client.js')(mongoose);

module.exports = db;