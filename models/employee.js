const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    employeeName: { type: String, required: true },
    age: { type: Number, required: true }
}, { _id: false });

module.exports = EmployeeSchema;