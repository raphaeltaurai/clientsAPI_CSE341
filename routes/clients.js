const routes = require('express').Router();
const clients = require('../controllers/client.js');

function requireAdmin(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated() && req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(401).send('Unauthorized');
}

// Get all clients (admin only if logged in), else API key required in controller
routes.get('/', requireAdmin, clients.findAll);

// Create a new client
routes.post('/', requireAdmin, clients.create);

// Get clients with additional info (admin only)
routes.get('/additional-info', requireAdmin, clients.findAllWithAdditionalInfo);

// Get a single client by id (admin only)
routes.get('/:client_id', requireAdmin, clients.findOne);

// Update a client by id
routes.put('/:client_id', requireAdmin, clients.update);

// Delete a client by id
routes.delete('/:client_id', requireAdmin, clients.delete);

// Delete all clients
routes.delete('/', requireAdmin, clients.deleteAll);

// Employee management routes
// Add an employee to a client
routes.post('/:client_id/employees', requireAdmin, clients.addEmployee);

// Get all employees for a specific client (admin only)
routes.get('/:client_id/employees', requireAdmin, clients.getClientEmployees);

// Remove an employee from a client
routes.delete('/:client_id/employees/:employee_id', requireAdmin, clients.removeEmployee);

module.exports = routes;