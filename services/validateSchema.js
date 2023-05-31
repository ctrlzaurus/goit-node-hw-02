const Joi = require('joi');

const contactAddSchema = Joi.object({
    name: Joi.string().required().messages({'any.required': `Missing required name field`}),
    email: Joi.string().required().messages({'any.required': `Missing required email field`}),
    phone: Joi.string().required().messages({'any.required': `Missing required phone field`}),
    favorite: Joi.boolean(),
});

const contactUpdateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required(),
});

const contactUpdateSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
    favorite: Joi.boolean(),
})
    .or('name', 'email', 'phone', 'favorite')
    .error(new Error('Missing fields'));

module.exports = {
    contactAddSchema,
    contactUpdateSchema,
    contactUpdateFavoriteSchema
}