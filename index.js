const express = require('express');
const path = require('path');
const expressSession = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const authRouter = require('./auth');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 1427;
const session = {
  secret: 'LoxodontaElephasMammuthusPalaeoloxodonPrimelephas',
  cookie: {},
  resave: false,
  saveUninitialized: false,
};
const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
      process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback',
  },
  function (accessToken, refreshToken, extraParams, profile, done) {
    /**
     * Access tokens are used to authorize users to an API
     * (resource server)
     * accessToken is the token to call the Auth0 API
     * or a secured third-party API
     * extraParams.id_token has the JSON Web Token
     * profile has all the information from the user
     */
    return done(null, profile);
  }
);

if (app.get('env') === 'production') {
  session.cookie.secure = true;
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession(session));
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});
const secured = (req, res, next) => {
  if (req.user) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  res.redirect('/login');
};
app.use('/', authRouter);

app.get('/', (req, res) => {
  //res.status(200).send("WHATABYT: Food For Devs");
  res.render('index', {title: 'Home'});
});

app.get('/user', secured, (req, res, next) => {
  const {_raw, _json, ...userProfile} = req.user;
  res.render('user', {
    title: 'Profile',
    userProfile: userProfile,
  });
});

app.listen(PORT, () => {
  console.log(`WHATABYTE app started. Accessible on 127.0.0.1:${PORT}`);
});
