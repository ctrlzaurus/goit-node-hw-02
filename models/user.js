const { Schema, model } = require('mongoose');
const handleMongooseError = require('../services/handleMongooswError');
const Joi = require('joi');

const userSchema = new Schema({
        password: {
          type: String,
          required: [true, 'Set password for user'],
        },
        email: {
          type: String,
          required: [true, 'Email is required'],
          unique: true,
        },
        subscription: {
          type: String,
          enum: ["starter", "pro", "business"],
          default: "starter"
        },
        token: {
            type: String,
            default: '',
        },
        avatarURL: {
          type: String,
          // required: true,
        },
        verify: {
          type: Boolean,
          default: false,
        },
        verificationToken: {
          type: String,
          required: [true, 'Verify token is required'],
        },
}, {
    versionKey: false,
    timestamps: true,
});

userSchema.post('save', handleMongooseError);

const userRegisterSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(8).required(),
    avatarURL: Joi.string(),
})

const userLoginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(8).required(),
})

const User = model('user', userSchema);

module.exports = {
    User,
    userRegisterSchema,
    userLoginSchema,
}