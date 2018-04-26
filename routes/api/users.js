const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const keys = require('../../config/keys');
const User = require('../../models/User');

//bringing validation and loads them
const signUpValid = require('../../validation/register');
const signInValid = require('../../validation/login');

//USERS INDEX ROUTER
router.get('/teste', (request, response) => response.json({flashMesg: 'Users Works'}));


//SIGN UP ROUTE
router.post('/signup', (request, res) => {
    const { errors, isValid } = signUpValid(request.body);
    if(!isValid) {
        return res.status(400).json(errors);
    }

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

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user =>  res.json(user))  // console.log(user)
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

    const { errors, isValid } = signInValid(request.body);
    if(!isValid) {
        return response.status(400).json(errors);
    }

    User.findOne({ email: email })
        .then(user => {
            if(!user) {
                //errors.email = 'User Not Found';
                const errors = 'User Not Found';
                return response.status(404).json({ email: 'User not Found'});
            }

            bcrypt.compare(password, user.password).then(isMatch => {
                if(isMatch) {
                    //response.json({ msg: 'Success'});
                    const userDetails = {
                        id: user.id,
                        name: user.name,
                        avatar: user.avatar
                    };
                    console.log(userDetails);
                    //login with jwt
                    jwt.sign(
                        userDetails,
                        keys.secretOrKey,
                        { expiresIn: 3600 },
                        (err, token) => {
                            response.json({
                                success: true,
                                token: `Bearer ${token}`
                            });
                        }
                    );

                } else {
                    //errors.password = 'Incorect Password';
                    const errors = 'Incorect Password';
                    return response.status(400).json({ password: 'Password Incorect'});
                }
            });
             
        });
        
});


//ON users success signin with jwt
router.get(
    '/current', passport.authenticate('jwt', { session: false }),
     (request, response) => {
        response.json({
            id: request.user.id,
            name: request.user.name,
            email: request.user.email,
            avatar: request.user.avatar,
        });
     }
);


module.exports = router;