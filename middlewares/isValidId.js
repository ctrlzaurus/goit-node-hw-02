const { isValidObjectId } = require('mongoose');
const HttpError = require('../services/HttpError');

const isValidId = (req, res, next) => {
    const id = req.params.contactId;
    console.log(id);
    if(!isValidObjectId(id)) {
        next(HttpError(400, `${id} is not valid id format`))
    };

    next();
}

module.exports = isValidId;