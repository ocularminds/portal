const express = require('express');
const path = require('path');
const {auth} = require('express-openid-connect');

const app = express();
const PORT = process.env.PORT || 1427;
const config = {
    required: false,
    auth0Logout: true,
    appSession: {
      secret: 'a long, randomly-generated string stored in env'
    },
    baseURL: 'http://localhost:3000',
    clientID: 'G5zLpAejLAVAWg5VxC0yxJ0rQREvKs00',
    issuerBaseURL: 'https://dev-auo9rt3x.auth0.com'
  };

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(auth(config));

app.get('/', (req, res) => {
  //res.status(200).send("WHATABYT: Food For Devs");
  res.render('index', {title: 'Home'});
});

app.get('/user', (req, res) => {
  res.render('user', {title: 'User Profile', userProfile: {nickname: 'Auth0'}});
});
app.listen(PORT, () => {
  console.log(`WHATABYTE app started. Accessible on 127.0.0.1:${PORT}`);
});
