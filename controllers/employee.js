const db = require('../models');
const Employee = db.employee;

const apiKey = process.env.API_KEY;

// Create a new Employee
exports.create = async (req, res) => {
  /*
    #swagger.description = 'API Key if needed: Ezl0961tEpx2UxTZ5v2uKFK91qdNAr5npRlMT1zLcE3Mg68Xwaj3N8Dyp1R8IvFenrVwHRllOUxF0Og00l0m9NcaYMtH6Bpgdv7N'
  */
  if (req.header('apiKey') !== apiKey) {
    return res.status(401).send('Invalid apiKey, please read the documentation.');
  }

  const { id, employeeName, age } = req.body || {};
  if (id === undefined || !employeeName || age === undefined) {
    return res.status(400).send({ message: 'Employee id, employeeName, and age are required!' });
  }

  try {
    const employee = new Employee({ id, employeeName, age });
    const data = await employee.save();
    res.status(201).send(data);
  } catch (err) {
    res.status(500).send({ message: err.message || 'Error creating employee.' });
  }
};

// Get all Employees
exports.findAll = async (req, res) => {
  /*
    #swagger.description = 'API Key if needed: Ezl0961tEpx2UxTZ5v2uKFK91qdNAr5npRlMT1zLcE3Mg68XwZj3N8Dyp1R8IvFenrVwHRllOUxF0Og00l0m9NcaYMtH6Bpgdv7N'
  */
  if (req.header('apiKey') !== apiKey) {
    return res.status(401).send('Invalid apiKey, please read the documentation.');
  }

  try {
    const data = await Employee.find({}, { _id: 0, id: 1, employeeName: 1, age: 1 });
    res.send(data);
  } catch (err) {
    res.status(500).send({ message: err.message || 'Error retrieving employees.' });
  }
};

// Get one Employee by id
exports.findOne = async (req, res) => {
  /*
    #swagger.description = 'API Key if needed: Ezl0961tEpx2UxTZ5v2uKFK91qdNAr5npRlMT1zLcE3Mg68XwZj3N8Dyp1R8IvFenrVwHRllOUxF0Og00l0m9NcaYMtH6Bpgdv7N'
  */
  if (req.header('apiKey') !== apiKey) {
    return res.status(401).send('Invalid apiKey, please read the documentation.');
  }

  const id = parseInt(req.params.id);
  try {
    const data = await Employee.findOne({ id });
    if (!data) return res.status(404).send({ message: 'Employee not found' });
    res.send(data);
  } catch (err) {
    res.status(500).send({ message: 'Error retrieving employee with id=' + id });
  }
};

// Update an Employee by id
exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: 'Data to update can not be empty!' });
  }

  const id = parseInt(req.params.id);
  try {
    const data = await Employee.findOneAndUpdate({ id }, req.body, { useFindAndModify: false, new: true });
    if (!data) return res.status(404).send({ message: `Cannot update Employee with id=${id}.` });
    res.send({ message: 'Employee updated successfully.', data });
  } catch (err) {
    res.status(500).send({ message: 'Error updating Employee with id=' + id });
  }
};

// Delete an Employee by id
exports.delete = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const data = await Employee.findOneAndDelete({ id });
    if (!data) return res.status(404).send({ message: `Cannot delete Employee with id=${id}.` });
    res.send({ message: 'Employee deleted successfully!' });
  } catch (err) {
    res.status(500).send({ message: 'Could not delete Employee with id=' + id });
  }
};

// Delete all Employees
exports.deleteAll = async (req, res) => {
  try {
    const data = await Employee.deleteMany({});
    res.send({ message: `${data.deletedCount} Employees were deleted successfully!` });
  } catch (err) {
    res.status(500).send({ message: err.message || 'Error removing all employees.' });
  }
};


