const ctrlWrapper = require("../utils/ctrlWrapper");
const { User } = require('../models/user');
const HttpError = require("../services/HttpError");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;
const gravatar = require('gravatar');
const fs = require('fs/promises');
const path = require('path');
const Jimp = require("jimp");
const { v4: uuidv4 } = require('uuid');
const sendEmail = require("../services/sendEmail");
const createVerificationEmail = require("../services/createVerificationEmail");

const avatarsDir = path.resolve('public', 'avatars');

const register = async(req, res) => {
    const { password, email } = req.body;

    const user = await User.findOne({ email })
    
    if(user) {
        throw HttpError(409, 'Email in use')
    }

    const avatarURL = gravatar.url(email);
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();
    const newUser = await User.create({ email, password: hashedPassword, avatarURL, verificationToken });

    const verifyEmail = createVerificationEmail(newUser.verificationToken, newUser.email);

    await sendEmail(verifyEmail);

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
        }
    })
};

const verify = async (req, res) => {
    const { verificationToken } = req.params;

    const user = await User.findOne({ verificationToken });

    if(!user) {
        throw HttpError(404, 'User not found')
    }

    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: '' });

    res.json({
        message: 'Verification successful'
    })
}

const login = async(req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
    if(!user) {
        throw HttpError(401, 'Email or password is wrong')
    }

    if(!user.verify) {
        throw HttpError(404, 'User not found')
    }

    const passwordCompareResalt = await bcrypt.compare(password, user.password);
    if(!passwordCompareResalt) {
        throw HttpError(401, 'Email or password is wrong')
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

    await User.findByIdAndUpdate(user.id, { token });

    res.json({
        token,
        user: {
            email: email,
            subscription: user.subscription,
        }
    })
};

const getCurrent = async(req, res, next) => {
    const { email, avatarURL } = req.user;

    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, 'Not authorized');
    }

    res.json({
        email,
        subscription: user.subscription,
        avatarURL,
    })
}

const logout = async (req, res) => {
    const { _id: id } = req.user;
    await User.findByIdAndUpdate(id, {token: ''});
    res.status(204).send();
}

const updateAvatar = async (req, res) => {
    const { path: tempPath, originalname } = req.file;
    const { _id } = req.user;
    const resultFilename = `${_id}_${originalname}`;
    const resultDir = path.join(avatarsDir, resultFilename);

    const avatar = await Jimp.read(tempPath)
	avatar.resize(250, 250).write(tempPath);

    await fs.rename(tempPath, resultDir);
	const avatarURL = path.join("avatars", resultFilename);

	await User.findByIdAndUpdate(_id, { avatarURL });
	res.status(200).json({ avatarURL });
}

const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if(!user) {
        throw HttpError(404);
    }

    if(user.verify) {
        throw HttpError(400, 'Verification has already been passed');
    }


    const verifyEmail = createVerificationEmail(user.verificationToken, user.email);

    await sendEmail(verifyEmail);

    res.json({
        message: 'Verification email sent'
    })
}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
    verify: ctrlWrapper(verify),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
}