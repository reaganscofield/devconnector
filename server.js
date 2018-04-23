const express = require('express');
const mongoose = require('mongoose');

const app = express();

const database = require('./config/keys').mongoURI;

mongoose
    .connect(database)
    .then(() => console.log('Successful Connected to Remote Databases'))
    .catch(err => console.log(err));

app.get('/', (request, response) => response.send('Hello Word'));

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const listenPort = process.env.PORT || 5000;
app.listen(listenPort,  () => console.log(`Server is Running On ${listenPort}`));