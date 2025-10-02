const routes = require('express').Router();
const client = require('./clients');

routes.use('/clients', client);
routes.get('/', (req, res) => {
  res.send({
    message: 'Hello World! Welcome to the Clients API',
    documentationURL: 'http://localhost:8000/api-docs',
    endpoints: {
      clients: '/clients',
      swagger: '/api-docs'
    }
  });
});

module.exports = routes;