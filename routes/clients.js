const routes = require('express').Router();
const clients = require('../controllers/client.js');

// Get all clients
routes.get('/', clients.findAll);

// Create a new client
routes.post('/', clients.create);

// Get clients with additional info
routes.get('/additional-info', clients.findAllWithAdditionalInfo);

// Get a single client by id
routes.get('/:client_id', clients.findOne);

// Update a client by id
routes.put('/:client_id', clients.update);

// Delete a client by id
routes.delete('/:client_id', clients.delete);

// Delete all clients
routes.delete('/', clients.deleteAll);

// Employee management routes
// Add an employee to a client
routes.post('/:client_id/employees', clients.addEmployee);

// Get all employees for a specific client
routes.get('/:client_id/employees', clients.getClientEmployees);

// Remove an employee from a client
routes.delete('/:client_id/employees/:employee_id', clients.removeEmployee);

module.exports = routes;