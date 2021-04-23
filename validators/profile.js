const Validator = require('validator');
const isEmpty = require('./is-empaty');

module.exports = function validateProfileInput(data) {
    let errors = {};

    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';
    
    if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
        errors.handle = "Handle must be between 2 and 30 charactors";
    }

    if (Validator.isEmpty(data.handle)) {
        errors.handle = 'Profile handle is reqiured';
    }

    if (Validator.isEmpty(data.status)) {
        errors.status = 'Status is reqiured';
    }

    if (Validator.isEmpty(data.skills)) {
        errors.skills = 'skills is reqiured';
    }

    if(!isEmpty(data.website)){
        if (!Validator.isURL(data.website)) {
            errors.website = 'Not a valid URL';
        }
    }

    if (!isEmpty(data.youtube)) {
        if (!Validator.isURL(data.youtube)) {
            errors.youtube = 'Not a valid URL';
        }
    }

    if (!isEmpty(data.twitter)) {
        if (!Validator.isURL(data.twitter)) {
            errors.twitter = 'Not a valid URL';
        }
    }

    if (!isEmpty(data.facebook)) {
        if (!Validator.isURL(data.facebook)) {
            errors.facebook = 'Not a valid URL';
        }
    }

    if (!isEmpty(data.linkedIn)) {
        if (!Validator.isURL(data.linkedIn)) {
            errors.linkedIn = 'Not a valid URL';
        }
    }

    if (!isEmpty(data.instagram)) {
        if (!Validator.isURL(data.instagram)) {
            errors.instagram = 'Not a valid URL';
        }
    }
    

    return {
        errors,
        isValid: isEmpty(errors)
    }
}