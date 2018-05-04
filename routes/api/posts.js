const express = require('express');
const router = express.Router();


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


module.exports = router;