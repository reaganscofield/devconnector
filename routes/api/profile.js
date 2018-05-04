const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//loads models
const Profile = require('../../models/profile');
const User = require('../../models/User');

//loads validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

router.get('/teste', (request, response) => response.json({flashMesg: 'Profile Works'}));


//get user
router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    (request, response) => {
        const errors = {};

        Profile.findOne({
            user: request.user.id
        }).populate('users', ['name', 'avatar'])
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

        Profile.find().populate('users', ['name', 'avatar'])
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
        .populate('users', ['name', 'avatar' ])
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
        .populate('users', ['name', 'avatar'])
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




// //post profile
router.post(
    '/',  passport.authenticate('jwt', { session: false }),
    (request, response) => {
        const { errors, isValid } = validateProfileInput(request.body);
        if(!isValid) {
            return response.status(400).json(errors);
        } else {
            const profileFields = {};

            //profile and user
            profileFields.user = request.user.id;
            if(request.body.handle) { profileFields.handle = request.body.handle }
            if(request.body.company) { profileFields.company = request.body.company }
            if(request.body.website) { profileFields.website = request.body.website }
            if(request.body.locaton) { profileFields.locaton = request.body.locaton }
            if(request.body.bio) { profileFields.bio = request.body.bio }
            if(request.body.status) { profileFields.status = request.body.status }
            if(request.body.githubrepo) { profileFields.githubrepo = request.body.githubrepo }

            if(typeof(request.body.skills) !== 'undefined') {
                profileFields.skills = request.body.skills.split(',');
            }

            //user social 
            profileFields.social = {};
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
                        { $set: profileFields },
                        { new: true }
                    ).then(profile => {
                        response.json(profile);
                        console.log(profile);
                    })
                } else { //create if not find
                    //check if handle exist
                    Profile.findOne({ hanlde:  profileFields.handle }).then(profile => {
                        if(profile) {
                            errors.handle = 'The handle aalready exist';
                            response.status(400).json(errors);
                            console.log(errors);
                        }

                        //save new profile
                        new Profile(profileFields).save().then(profile => {
                            response.json(profile);
                            console.log(profile);
                        })
                    });
                    
                }
            })
        }
    }
);


router.post(
    '/experience',
    passport.authenticate('jwt', { session: false }),
    (request, response) => {
        const { errors, isValid } = validateExperienceInput(request.body);

        if(!isValid) {
            console.log(errors);
            return response.status(400).json(errors);
        }

        Profile.findOne({ user: request.user.id }).then(profile => {
            newExperience = {
                title: request.body.title,
                company: request.body.company,
                location: request.body.location,
                fromDate: request.body.fromDate,
                to: request.body.to,
                current: request.body.current,
                description: request.body.description
            };

            profile.experience.unshift(newExperience);

            profile.save().then(profile => {
                response.json(profile);
                console.log(profile);
            })
        })
    }
);

router.post(
    '/education',
    passport.authenticate('jwt', { session: false }),
    (request, response) => {
      const { errors, isValid } = validateEducationInput(request.body);
  
     
      if (!isValid) {
        return response.status(400).json(errors);
      }
  
      Profile.findOne({ user: request.user.id }).then(profile => {
        const newEducation = {
          school: request.body.school,
          degree: request.body.degree,
          fieldOfStudy: request.body.fieldOfStudy,
          from: request.body.from,
          to: request.body.to,
          current: request.body.current,
          description: request.body.description
        };
  
    
        profile.education.unshift(newEducation);

        profile.save().then(profile => {
            response.json(profile);
            console.log(profile);
        });
      });
    }
  );


router.delete(
      '/experience/:exp_id',
      passport.authenticate('jwt', { session: false }),
      (request, response) => {
          Profile.findOne({ user: request.user.id })
          .then(profile => {
              const getIndex = profile.experience
              .map(item => item.id)
              .indexOf(request.params.exp_id)
            
            profile.experience.splice(getIndex, 1);

            profile.save().then(profile => {
                response.json(profile);
                console.log(profile);
            })
          })
          .catch(err => {
              response.status(404).json(err);
              console.log(err);
          });
      }
);


router.delete(
    '/education/:edu_id',
    passport.authenticate('jwt', { session: false }),
    (request, response) => {
        Profile.findOne({ user: request.user.id })
        .then(profile => {
            const getIndex = profile.education
            .map(item => item.id)
            .indexOf(request.params.edu_id)
          
          profile.education.splice(getIndex, 1);

          profile.save().then(profile => {
              response.json(profile);
              console.log(profile);
          })
        })
        .catch(err => {
            response.status(404).json(err);
            console.log(err);
        });
    }
);


router.delete(
    '/',
    passport.authenticate('jwt', { session: false }),
    (request, response) => {
        Profile.findOneAndRemove({ user: request.user.id }).then(() => {
            User.findOneAndRemove({ _id: request.user.id }).then(() => {
                response.json({ success:  true });
            })
        })
    }
);


module.exports = router;