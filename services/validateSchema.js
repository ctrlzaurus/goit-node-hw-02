const Joi = require('joi');

const contactAddSchema = Joi.object({
    name: Joi.string().required().messages({'any.required': `Missing required name field`}),
    email: Joi.string().required().messages({'any.required': `Missing required email field`}),
    phone: Joi.string().required().messages({'any.required': `Missing required phone field`}),
    favorite: Joi.boolean(),
});

const contactUpdateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required().messages({'any.required': `Missing field favorite`}),
});

const contactUpdateSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    favorite: Joi.boolean(),
})
    .or('name', 'email', 'phone', 'favorite')
    .error(new Error('Missing fields'));

module.exports = {
    contactAddSchema,
    contactUpdateSchema,
    contactUpdateFavoriteSchema
}