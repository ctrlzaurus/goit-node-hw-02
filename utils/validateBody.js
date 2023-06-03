const HttpError = require("../services/HttpError");

function validateBody(schema) {
    function func(req, res, next) {

        if (Object.keys(req.body).length === 0) {

            const message = "Missing fields";
            throw HttpError(400, message);
        } else {
            const { error } = schema.validate(req.body);

            if (error) {

                const message = `Missing required ${error.details[0].context.label} field`;
                throw HttpError(400, message);
            }
        }

        next();
    }

    return func;
}


module.exports = validateBody;