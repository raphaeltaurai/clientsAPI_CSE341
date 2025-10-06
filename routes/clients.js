const routes = require('express').Router();
const clients = require('../controllers/client.js');

function requireAdmin(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated() && req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(401).send('Unauthorized');
}

// Get all clients (public)
routes.get('/', clients.findAll);

// Create a new client (admin only)
routes.post('/', requireAdmin, clients.create);

// Get clients with additional info (public)
routes.get('/additional-info', clients.findAllWithAdditionalInfo);

// Get a single client by id (public)
routes.get('/:client_id', clients.findOne);

// Update a client by id (admin only)
routes.put('/:client_id', requireAdmin, clients.update);

// Delete a client by id (admin only)
routes.delete('/:client_id', requireAdmin, clients.delete);

// Delete all clients (admin only)
routes.delete('/', requireAdmin, clients.deleteAll);

// Employee management routes
// Add an employee to a client (admin only)
routes.post('/:client_id/employees', requireAdmin, clients.addEmployee);

// Get all employees for a specific client (public)
routes.get('/:client_id/employees', clients.getClientEmployees);

// Remove an employee from a client (admin only)
routes.delete('/:client_id/employees/:employee_id', requireAdmin, clients.removeEmployee);

module.exports = routes;