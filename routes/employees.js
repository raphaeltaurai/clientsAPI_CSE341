const routes = require('express').Router();
const employees = require('../controllers/employee.js');

routes.get('/', employees.findAll);
routes.post('/', employees.create);
routes.get('/:id', employees.findOne);
routes.put('/:id', employees.update);
routes.delete('/:id', employees.delete);
routes.delete('/', employees.deleteAll);

module.exports = routes;


