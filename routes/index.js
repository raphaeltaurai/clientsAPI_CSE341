const routes = require('express').Router();
const client = require('./clients');
const employee = require('./employees');

routes.use('/clients', client);
routes.use('/employees', employee);
routes.get('/', (req, res) => {
  res.send({
    message: 'Hello World! Welcome to the Clients API',
    documentationURL: 'http://localhost:8000/api-docs',
    endpoints: {
      clients: '/clients',
      employees: '/employees',
      swagger: '/api-docs'
    }
  });
});

module.exports = routes;