const express = require('express');
const cors = require('cors');
const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const db = require('./models');


app
.set('trust proxy', 1)
.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
.use(cors())
.use(express.json())
.use(express.urlencoded({ extended: true }))
.use(session({
  secret: process.env.SESSION_SECRET || 'change-me',
  resave: false,
  saveUninitialized: false,
}))
.use(passport.initialize())
.use(passport.session())
.use('/', require('./routes'))
.use('/auth', require('./routes/auth'));

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => { console.log('Connected to the database!'); })
  .catch((err) => {
    console.log('Cannot connect to the database!', err);
    process.exit();
  });

  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });

// Passport config
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.user.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID || '',
  clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
  // Use explicit callback URL when provided to avoid proxy/protocol mismatches
  callbackURL: process.env.GITHUB_CALLBACK_URL || '/auth/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const existing = await db.user.findOne({ provider: 'github', providerId: profile.id });
    if (existing) return done(null, existing);
    
    // Get email from GitHub profile, or use a fallback
    const email = (profile.emails && profile.emails[0] && profile.emails[0].value) || 
                  `github-${profile.id}@example.com`;
    
    const user = await db.user.create({
      provider: 'github',
      providerId: profile.id,
      email: email,
      displayName: profile.displayName || profile.username || 'GitHub User',
      photo: (profile.photos && profile.photos[0] && profile.photos[0].value) || '',
      role: 'admin' // Seed first login as admin; adjust as needed
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
}));