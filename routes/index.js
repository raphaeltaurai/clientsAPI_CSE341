const routes = require('express').Router();
const client = require('./clients');

routes.use('/clients', client);
routes.get('/', (req, res) => {
  const protocol = req.protocol;
  const host = req.get('host');
  const isAuthed = req.isAuthenticated && req.isAuthenticated();
  
  if (isAuthed) {
    // User is logged in - show personalized welcome
    const userName = req.user && req.user.displayName || req.user && req.user.email || 'User';
    res.send({
      message: `Welcome back, ${userName}! You are successfully logged in.`,
      authenticated: true,
      user: { 
        id: req.user && req.user.id, 
        email: req.user && req.user.email, 
        displayName: req.user && req.user.displayName 
      },
      logoutURL: `${protocol}://${host}/auth/logout`,
      documentationURL: `${protocol}://${host}/api-docs`,
      endpoints: {
        clients: '/clients',
        swagger: '/api-docs'
      }
    });
  } else {
    // User is not logged in - show login options
    res.send({
      message: 'Welcome to the Clients API! Please log in to access protected features.',
      authenticated: false,
      loginURL: `${protocol}://${host}/auth/github`,
      documentationURL: `${protocol}://${host}/api-docs`,
      endpoints: {
        clients: '/clients',
        swagger: '/api-docs'
      }
    });
  }
});

module.exports = routes;