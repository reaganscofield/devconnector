const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

//initialised server
const app = express();

//users bodyParser for form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//connecting to db
const database = require('./config/keys').mongoURI;
const databaseLocal = require('./config/keys').localDbConnector;
mongoose
    .connect(databaseLocal)
    .then(() => console.log('Successful Connected to Remote Databases'))
    .catch(err => console.log(err));

//passport initialisation
app.use(passport.initialize());
require('./config/passport')(passport);

//get index routes
app.get('/', (request, response) => response.send('Hello Word'));

//getting restful api routers from routes dir
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

//routers
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

//running server
const listenPort = process.env.PORT || 4200;
app.listen(listenPort,  () => console.log(`Server is Running On ${listenPort}`));