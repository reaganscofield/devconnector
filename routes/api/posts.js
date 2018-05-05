const express = require('express');
const router = express.Router();
const passport = require('passport');


const Profile = require('../../models/profile');
const Post = require('../../models/post');

const validatePostInput = require('../../validation/post');


router.get('/test', (request, response) => {
    response.json({ msg: 'post works '});
});

router.get('/', (request, response) => {
   Post.find()
    .sort({ date: -1 }).then(posts => {
        response.json(posts);
    })
    .catch(err => {
        console.log(err);
        response.status(404).json({ flashMsg: 'There is Not Post'});
    })
});

router.get('/:id', (request, response) => {
    Post.findById(request.params.id)
        .then(post => {
            response.json(post);
            console.log(post);
        })
        .catch(err => {
            console.log(err);
            response.status(404).json({ flashMsg: 'Not Post Have Been Fund'});
        })
});

router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    (request, response) => {
        const { errors, isValid } = validatePostInput(request.body);

        if(!isValid) {
            return response.status(400).json(errors);
        }
        const newPost = new Post({
            text: request.body.text,
            name: request.body.avatar,
            user: request.user.id
        });
        newPost.save().then(post => {
            console.log(post);
            response.json(post);
        });
    }
);

router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    (request, response) => {
        Profile.findOne({ user: request.user.id }).then(profile => {
            Post.findById(request.params.id).then(post => {
                if(post.user.toString() !== request.user.id ) {
                    const flash = 'You Not Authorized to Delete';
                    return response.status(401).json(flash);
                }
                
                post.remove().then(() => {
                    response.json({ success: 'Success Deleted Post'});
                })
                .catch(err => {
                    response.status(404).json({ noFund: 'post not fund '});
                })
            });
        })
    }
);


router.post(
    '/like/:id',
    passport.authenticate('jwt', { session: false }),
    (request, response) => {
        Profile.findOne({ user: request.user.id }).then(profile => {
            Post.findById(request.params.id).then(post => {
                if(post.likes.filter(like => like.user.toString() === request.user.id).lenght > 0 ){
                    return response.status(400).json({ alreadyLiked: 'User Already Like this Post'});
                }

                post.likes.unshift({ user: request.user.id });
                post.save().then(post => {
                    response.json(post);
                    console.log(post)
                })
            })
            .catch(err => {
                response.status(404).json({ not: 'post not fund'});
                console.log(err);
            })
        })
    }
);


router.post(
    '/unlike/:id',
    passport.authenticate('jwt', { session: false }),
    (request, response) => {
        Profile.findOne({ user: request.user.id }).then(profile => {
            Post.findById(request.params.id).then(post => {
                if(post.likes.filter(like => like.user.toString() === request.user.id).lenght === 0 ){
                    return response.status(400).json({ alreadyLiked: 'you have not Like this Post'});
                }

                const removeIndex = post.likes
               .map(item => item.user.toString())
               .indexOf(request.user.id);

               post.likes.splice(removeIndex, 1);

                post.save().then(post => {
                    response.json(post);
                    console.log(post);
                });
            })
            .catch(err => {
                response.status(404).json({ not: 'post not fund'});
                console.log(err);
            })
        })
    }
);

router.post(
    '/comment/:id',
    passport.authenticate('jwt', { session: false }),
    (request, response) => {
        const { errors, isValid } = validatePostInput(request.body);

        if(!isValid) {
            return response.status(400).json(errors);
        }

        Post.findById(request.params.id).then(post => {
            const newComment = {
                text: request.body.text,
                name: request.body.name,
                avatar: request.body.avatar,
                user: request.user.id
            };

            post.comments.unshift(newComment);

            post.save().then(post => {
                response.json(post);
                console.log(post);
            });
        })
        .catch(err => {
            response.status(404).json({ notFund: ' No Post Fund'});
            console.log(err);
        });
    }
);


router.delete(
    '/comment/:id/:comment_id',
    passport.authenticate('jwt', { session: false }),
    (request, response) => {
        Post.findById(request.params.id).then(post => {
            if(post.comments.filter(comment => comment._id.toString() === request.params.comment_id).lenght === 0) {
                return response.status(404).json({ commentNotExist: 'Comment does not exist'})
            }

            const removeIndex = post.comments.map(item => item.id.toString())
                                    .indexOf(request.params.comment_id);
            post.comments.splice(removeIndex, 1);
            post.save().then(post => {
                response.json(post);
                console.log(post);
            });
        })
        .catch(err => {
            response.status(404).json({ notFund: ' No Post Fund'});
            console.log(err);
        });
    }
)


module.exports = router;