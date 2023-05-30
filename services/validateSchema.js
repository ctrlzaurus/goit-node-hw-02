const Joi = require('joi');

const contactAddSchema = Joi.object({
    name: Joi.string().required().messages({'any.required': `Missing required name field`}),
    email: Joi.string().required().messages({'any.required': `Missing required email field`}),
    phone: Joi.string().required().messages({'any.required': `Missing required phone field`}),
});

const contactUpdateSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
})
    .or('name', 'email', 'phone')
    .error(new Error('Missing fields'));

module.exports = {
    contactAddSchema,
    contactUpdateSchema,
}