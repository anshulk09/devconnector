const isEmpty = value => 
// if there is a value in the error/value object it will return false
    value === undefined || value === null ||
    (typeof(value) === 'object' && Object.keys(value).length === 0) ||
    (typeof(value) === 'string' && value.trim().length === 0);



export default isEmpty;