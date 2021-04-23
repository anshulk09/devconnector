const Validator = require('validator');
const isEmpty = require('./is-empaty');

module.exports = function validateExperienceInput(data) {
    let errors = {};

    data.title = !isEmpty(data.title) ? data.title : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    data.fromDate = !isEmpty(data.fromDate) ? data.fromDate : '';

    if (Validator.isEmpty(data.title)) {
        errors.title = 'title is reqiured';
    }

    if (Validator.isEmpty(data.company)) {
        errors.company = 'company is reqiured';
    }

    if (Validator.isEmpty(data.fromDate)) {
        errors.fromDate = 'fromDate is reqiured';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}