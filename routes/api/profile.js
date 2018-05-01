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


//get handle, getting profile by handle with handle params
router.get('/handle/:handle', (request, response) => {
    const errors = {};
    
    Profile.findOne({ handle: request.params.handle })
        .populate('user', ['name', 'avatar' ])
        .then(profile => {
            if(!profile) {
                errors.noprofile = 'there is not profile for this user';
                response.status(404).json(errors);
                console.log(errors);
            } else {
                response.json(profile);
                console.log(profile);
            }
        })
        .catch(err => {
            response.status(404).json(err);
            console.log(err);
        })
});

//get user wiith id
router.get('/user/:user_id', (request, response) => {
    const errors = {};

    Profile.findOne({ user: request.params.user_id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile) {
                errors.noprofile = 'there is not profile for this user';
                response.status(404).json(errors);
                console.log(errors);
            } else {
                response.json(profile);
                console.log(profile);
            }
        })
        .catch(err => {
            response.status(404).json({ profile: 'there is not user for this profile'});
            console.log(err);
        })
});


const validateProfileInput = require('../../validation/profile');

// //post profile
router.post(
    '/',  passport.authenticate('jwt', { session: false }),
    (request, response) => {
        const { errors, isValid } = validateProfileInput(request.body);
        if(!isValid) {
            return response.status(400).json(errors);
        } else {
            const profileields = {};

            //profile and user
            profileields.user = request.user.id;
            if(request.body.handle) { profileields.handle = request.body.handle }
            if(request.body.company) { profileields.company = request.body.company }
            if(request.body.website) { profileields.website = request.body.website }
            if(request.body.locaton) { profileields.locaton = request.body.locaton }
            if(request.body.bio) { profileields.bio = request.body.bio }
            if(request.body.status) { profileields.status = request.body.status }
            if(request.body.githubrepo) { profileields.githubrepo = request.body.githubrepo }

            if(typeof(request.body.skills) !== 'undefined') {
                profileields.skills = request.body.skills.split(',');
            }

            //user social 
            profileields.social = {};
            if(request.body.youtube) { profileFields.social.youtube = request.body.youtube }
            if(request.body.twitter) { profileFields.social.twitter = request.body.twitter }
            if(request.body.facebook) { profileFields.social.facebook = request.body.facebook }
            if(request.body.linkedin) { profileFields.social.linkedin = request.body.linkedin }
            if(request.body.instagram) { profileFields.social.instagram = request.body.instagram }

            Profile.findOne({ user: request.user.id }).then(profile => {
                if(profile) {
                    //find and update it
                    Profile.findOneAndUpdate(
                        { user: request.user.id },
                        { $set: profileields },
                        { new: true }
                    ).then(profile => {
                        response.json(profile);
                        console.log(profile);
                    })
                } else { //create if not find
                    //check if handle exist
                    Profile.findOne({ hanlde:  profileields.handle }).then(profile => {
                        if(profile) {
                            errors.handle = 'The handle aalready exist';
                            response.status(400).json(errors);
                            console.log(errors);
                        }

                        //save new profile
                        new Profile(profileields).save().then(profile => {
                            response.json(profile);
                            console.log(profile);
                        })
                    });
                    
                }
            })
        }
    }
);


module.exports = router;