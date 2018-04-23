const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');

router.get('/teste', (request, response) => response.json({flashMesg: 'Users Works'}));

router.post('/signup', (request, response) => {
    User.findOne({ email: request.body.email }).then(user => {
        if(user) {
            errors.email = 'Email Already Exists';
            return response.status(400).json(errors);
        } else {
            const avatar = gravatar.url(request.body.email, {
                s: '2000',
                r: 'pg',
                d: 'mm'
            });

            const newUser = new User({
                name: request.body.name,
                email: request.body.email,
                avatar: avatar,
                password: request.body.password
            });

            bcrypt.genSalt(20, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => response.json(user))
                        //.then(user => console.log(user))
                        .catch(err => console.log(err));
                })
            })
        }
    })
})

module.exports = router;