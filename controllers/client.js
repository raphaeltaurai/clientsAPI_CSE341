const db = require('../models');
const Client = db.client;

const apiKey = process.env.API_KEY;

exports.create = async (req, res) => {
  /*
    #swagger.description = 'API Key if needed: Ezl0961tEpx2UxTZ5v2uKFK91qdNAr5npRlMT1zLcE3Mg68Xwaj3N8Dyp1R8IvFenrVwHRllOUxF0Og00l0m9NcaYMtH6Bpgdv7N'
  */
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: 'Client name is required!' });
    return;
  }

  if (!req.body.client_id) {
    res.status(400).send({ message: 'Client ID is required!' });
    return;
  }

  // Create a Client
  const client = new Client({
    client_id: req.body.client_id,
    name: req.body.name,
    companyCode: req.body.companyCode,
    address: req.body.address,
    additionalInfo: req.body.additionalInfo,
    employees: req.body.employees || []
  });
  
  try {
    const data = await client.save();
    res.status(201).send(data);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).send({ message: 'Client with this ID already exists!' });
    } else {
      res.status(500).send({ message: err.message || 'Some error occurred while creating the Client.' });
    }
  }
};

exports.findAll = async (req, res) => {
  /*
    #swagger.description = 'API Key if needed: Ezl0961tEpx2UxTZ5v2uKFK91qdNAr5npRlMT1zLcE3Mg68XwZj3N8Dyp1R8IvFenrVwHRllOUxF0Og00l0m9NcaYMtH6Bpgdv7N'
  */
  const isAdmin = req.isAuthenticated && req.isAuthenticated() && req.user && req.user.role === 'admin';
  if (isAdmin || req.header('apiKey') === apiKey) {
    try {
      const data = await Client.find(
        {},
        { client_id: 1, name: 1, companyCode: 1, address: 1, additionalInfo: 1, employees: 1, _id: 0 }
      );
      res.send(data);
    } catch (err) {
      res.status(500).send({ message: err.message || 'Some error occurred while retrieving clients.' });
    }
  } else {
    res.status(401).send('Invalid apiKey, please read the documentation.');
  }
};

// Find a single Client with an id
exports.findOne = async (req, res) => {
  /*
    #swagger.description = 'API Key if needed: Ezl0961tEpx2UxTZ5v2uKFK91qdNAr5npRlMT1zLcE3Mg68XwZj3N8Dyp1R8IvFenrVwHRllOUxF0Og00l0m9NcaYMtH6Bpgdv7N'
  */
  const client_id = req.params.client_id;
  if (req.header('apiKey') === apiKey) {
    try {
      const data = await Client.find({ client_id: client_id });
      if (!data || data.length === 0) {
        res.status(404).send({ message: 'Not found Client with id ' + client_id });
      } else {
        res.send(data[0]);
      }
    } catch (err) {
      res.status(500).send({ message: 'Error retrieving Client with client_id=' + client_id });
    }
  } else {
    res.status(401).send('Invalid apiKey, please read the documentation.');
  }
};

// Update a Client by the id in the request
exports.update = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).send({ message: 'Data to update can not be empty!' });
  }

  // Basic validation on known fields if present
  const { name, companyCode, address, additionalInfo, employees } = req.body;
  if (name !== undefined && typeof name !== 'string') {
    return res.status(400).send({ message: 'name must be a string' });
  }
  if (companyCode !== undefined && typeof companyCode !== 'string') {
    return res.status(400).send({ message: 'companyCode must be a string' });
  }
  if (address !== undefined && typeof address !== 'string') {
    return res.status(400).send({ message: 'address must be a string' });
  }
  if (additionalInfo !== undefined && typeof additionalInfo !== 'boolean') {
    return res.status(400).send({ message: 'additionalInfo must be a boolean' });
  }
  if (employees !== undefined) {
    const isValidArray = Array.isArray(employees) && employees.every((e) =>
      e && typeof e.id === 'number' && typeof e.employeeName === 'string' && typeof e.age === 'number'
    );
    if (!isValidArray) {
      return res.status(400).send({ message: 'employees must be an array of {id:number, employeeName:string, age:number}' });
    }
  }

  const client_id = req.params.client_id;

  try {
    const data = await Client.findOneAndUpdate(
      { client_id: client_id },
      req.body,
      { useFindAndModify: false, new: true }
    );
    if (!data) {
      res.status(404).send({ message: `Cannot update Client with id=${client_id}. Maybe Client was not found!` });
    } else {
      res.send({ message: 'Client was updated successfully.', data: data });
    }
  } catch (err) {
    res.status(500).send({ message: 'Error updating Client with id=' + client_id });
  }
};

// Delete a Client with the specified id in the request
exports.delete = async (req, res) => {
  const client_id = req.params.client_id;

  try {
    const data = await Client.findOneAndDelete({ client_id: client_id });
    if (!data) {
      res.status(404).send({ message: `Cannot delete Client with id=${client_id}. Maybe Client was not found!` });
    } else {
      res.send({ message: 'Client was deleted successfully!' });
    }
  } catch (err) {
    res.status(500).send({ message: 'Could not delete Client with id=' + client_id });
  }
};

// Delete all Clients from the database.
exports.deleteAll = async (req, res) => {
  try {
    const data = await Client.deleteMany({});
    res.send({ message: `${data.deletedCount} Clients were deleted successfully!` });
  } catch (err) {
    res.status(500).send({ message: err.message || 'Some error occurred while removing all clients.' });
  }
};

// Find all clients with additional info
exports.findAllWithAdditionalInfo = async (req, res) => {
  try {
    const data = await Client.find({ additionalInfo: true });
    res.send(data);
  } catch (err) {
    res.status(500).send({ message: err.message || 'Some error occurred while retrieving clients with additional info.' });
  }
};

// Add an employee to a client
exports.addEmployee = async (req, res) => {
  const client_id = req.params.client_id;
  const employee = req.body;

  // Validate employee data
  if (!employee.id || !employee.employeeName || !employee.age) {
    return res.status(400).send({
      message: 'Employee id, name, and age are required!'
    });
  }

  try {
    const data = await Client.findOneAndUpdate(
      { client_id: client_id },
      { $push: { employees: employee } },
      { new: true }
    );
    if (!data) {
      res.status(404).send({ message: `Client with id=${client_id} not found!` });
    } else {
      res.send({ message: 'Employee added successfully!', data: data });
    }
  } catch (err) {
    res.status(500).send({ message: 'Error adding employee to client with id=' + client_id });
  }
};

// Remove an employee from a client
exports.removeEmployee = async (req, res) => {
  const client_id = req.params.client_id;
  const employee_id = req.params.employee_id;

  try {
    const data = await Client.findOneAndUpdate(
      { client_id: client_id },
      { $pull: { employees: { id: parseInt(employee_id) } } },
      { new: true }
    );
    if (!data) {
      res.status(404).send({ message: `Client with id=${client_id} not found!` });
    } else {
      res.send({ message: 'Employee removed successfully!', data: data });
    }
  } catch (err) {
    res.status(500).send({ message: 'Error removing employee from client with id=' + client_id });
  }
};

// Get all employees for a specific client
exports.getClientEmployees = async (req, res) => {
  const client_id = req.params.client_id;

  try {
    const data = await Client.findOne({ client_id: client_id }, { employees: 1, name: 1, _id: 0 });
    if (!data) {
      res.status(404).send({ message: `Client with id=${client_id} not found!` });
    } else {
      res.send({ clientName: data.name, employees: data.employees || [] });
    }
  } catch (err) {
    res.status(500).send({ message: 'Error retrieving employees for client with id=' + client_id });
  }
};