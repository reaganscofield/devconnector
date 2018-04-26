const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function signInValid(data) {
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
   
    if(validator.isEmpty(data.email)) {
        errors.email = "Please Enter Your Email";
    }
    if(!validator.isEmail(data.email)) {
        errors.email = "Your Email is Not Valid"
    }

    if(validator.isEmpty(data.password)) {
        errors.password = "Please Enter Your Password";
    }
   
    return {
        errors,
        isValid: isEmpty(errors)
    };
};