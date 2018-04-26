const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function signUpValid(data) {
    let errors = {};
    
    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';

    if(validator.isEmpty(data.name)) {
        errors.name = "Please Enter Your Name";
    }
    if(!validator.isLength(data.name, { min: 3, max: 15 })) {
        errors.name = "Name Must Be Between 3 and 15 Characters";
    }

    if(validator.isEmpty(data.email)) {
        errors.email = "Please Enter Your Email";
    }
    if(!validator.isEmail(data.email)) {
        errors.email = "Your Email is Not Valid"
    }


    if(validator.isEmpty(data.password)) {
        errors.password = "Please Enter Your Password";
    }
    if(!validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "Password Must be at least 6 to 30 Characters";
    }
    if(validator.isEmpty(data.password2)) {
        errors.password2 = "Please Comfirm your Password";
    }
    if(!validator.equals(data.password, data.password2)) {
        errors.password2 = "Make Sure Password Much Each Other";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};