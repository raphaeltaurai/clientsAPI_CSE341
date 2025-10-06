const router = require('express').Router();
const passport = require('passport');
const db = require('../models');

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login-failed' }),
  (req, res) => {
    res.redirect('/');
  }
);

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Note: Local email/password endpoints removed; GitHub OAuth only

module.exports = router;

