const Validator = require('validator');
const isEmpty = require('./is-empaty');

module.exports = function validateLoginInput(data) {
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    
    if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email is reqiured';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password is reqiured';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}