const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');

//USERS INDEX ROUTER
router.get('/teste', (request, response) => response.json({flashMesg: 'Users Works'}));


//SIGN UP ROUTE
router.post('/signup', (request, res) => {
    User.findOne({ email: request.body.email }).then(user => {
        if(user) {
            //errors.email = 'Email already exists';
            const errors = 'Email Already Exists';
            console.log(`a new user tried to register with an existing email ${errors}`);
            return res.status(400).json(errors);
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
                        .then(user =>  res.json(user))  //console.log(user)
                        .catch(err => console.log(err));
                })
            })
        }
    })
});


//LOGIN ROUTER 
router.post('/login', (request, response) => {
    const email = request.body.email;
    const password = request.body.password;

    User.findOne({ email })
        .then(user => {
            if(!user) {
                //errors.email = 'User Not Found';
                //const errors = 'User Not Found';
                return response.status(404).json({ email: 'User not Found'});
            }

            bcrypt.compare(password, user.password).then(isMatch => {
                if(isMatch) {
                    response.json({ msg: 'Success'});
                } else {
                    //errors.password = 'Incorect Password';
                    //const errors = 'Incorect Password';
                    return response.status(400).json({ password: 'Password Incorect'});
                }
            });
             
        });
        
});

module.exports = router;