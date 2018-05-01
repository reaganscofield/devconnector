const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

router.get('/teste', (request, response) => response.json({flashMesg: 'Profile Works'}));

const Profile = require('../../models/profile');
const User = require('../../models/User');

//get user
router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    (request, response) => {
        const errors = {};

        Profile.findOne({
            user: request.user.id
        }).populate('user', ['name', 'avatar'])
          .then(profile => {
              if(!profile) {
                  errors.noprofile = 'There is not Profile for this User';
                  return response.status(404).json(errors);
              } else {
                response.json(profile); 
              }
          })
          .catch(err => {
              response.status(404).json(err);
              console.log(err);
          })
    }
);

//get all users
router.get('/all', (request, response) => {
        const errors =  {};

        Profile.find().populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile) {
                errors.noprofile = 'There are not Profiles';
                return response.status(404).json(errors);
            } else {
                response.json(profile);
            }
        })
        .catch(err => {
            response.status(404).json(err);
            console.log(err);
        })
});


//post 
// router.post(
//     '/', passport.authenticate('jwt', { session: false },)
//     (request, response) => {
//         const {}
// });




module.exports = router;