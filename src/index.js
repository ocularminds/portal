const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const path = require('path');
const expressSession = require('express-session');
const passport = require('passport');
const authRouter = require('./auth');
const {startDatabase} = require('./database/mongo');
const AdRoutes = require('./ads/ad.routes');
const {insertAd} = require('./ads/ad.service');
const {session, strategy, checkJwt} = require('./config');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 1427;
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
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));
//app.use(checkJwt);
app.use('/api/ad', AdRoutes);

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
  res.render('index', {title: 'Home'});
});

app.get('/user', secured, (req, res, next) => {
  const {_raw, _json, ...userProfile} = req.user;
  res.render('user', {
    title: 'Profile',
    userProfile: userProfile,
  });
});
// start the in-memory MongoDB instance
startDatabase().then(async () => {
  await insertAd({title: 'Hello, now from the in-memory database!'});
  // start the server
  app.listen(PORT, async () => {
    console.log(`listening on port ${PORT}`);
  });
});
