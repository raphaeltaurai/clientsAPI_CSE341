const routes = require('express').Router();
const client = require('./clients');

routes.use('/clients', client);
routes.get('/', (req, res) => {
  const protocol = req.protocol;
  const host = req.get('host');
  const isAuthed = req.isAuthenticated && req.isAuthenticated();
  res.send({
    message: 'Hello World! Welcome to the Clients API',
    authenticated: !!isAuthed,
    user: isAuthed ? { id: req.user && req.user.id, email: req.user && req.user.email, displayName: req.user && req.user.displayName } : null,
    loginURL: isAuthed ? null : `${protocol}://${host}/auth/github`,
    logoutURL: isAuthed ? `${protocol}://${host}/auth/logout` : null,
    documentationURL: `${protocol}://${host}/api-docs`,
    endpoints: {
      clients: '/clients',
      swagger: '/api-docs'
    }
  });
});

module.exports = routes;