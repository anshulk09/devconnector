const Validator = require('validator');
const isEmpty = require('./is-empaty');

module.exports = function validateExperienceInput(data) {
    let errors = {};

    data.school = !isEmpty(data.school) ? data.school : '';
    data.degree = !isEmpty(data.degree) ? data.degree : '';
    data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
    data.fromDate = !isEmpty(data.fromDate) ? data.fromDate : '';

    if (Validator.isEmpty(data.school)) {
        errors.school = 'school is reqiured';
    }

    if (Validator.isEmpty(data.degree)) {
        errors.degree = 'degree is reqiured';
    }

    if (Validator.isEmpty(data.fieldofstudy)) {
        errors.fieldofstudy = 'fieldofstudy is reqiured';
    }

    if (Validator.isEmpty(data.fromDate)) {
        errors.fromDate = 'fromDate is reqiured';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}