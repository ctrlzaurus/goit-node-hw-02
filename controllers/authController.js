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

const avatarsDir = path.resolve('public', 'avatars');

const register = async(req, res) => {
    const { password, email } = req.body;

    const user = await User.findOne({ email })
    if(user) {
        throw HttpError(409, 'Email in use')
    }

    const avatarURL = gravatar.url(email);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ email, password: hashedPassword, avatarURL });

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
        }
    })
};

const login = async(req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
    if(!user) {
        throw HttpError(401, 'Email or password is wrong')
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
	avatar.cover(250, 250).write(tempPath);

    await fs.rename(tempPath, resultDir);
	const avatarURL = path.join("avatars", resultFilename);

	await User.findByIdAndUpdate(_id, { avatarURL });
	res.status(200).json({ avatarURL });
    // const resultDir = path.join(avatarsDir, originalname);

    // const avatarURL = `/avatars/${resultFilename}`;

    // const avatarURL = `/avatars/${originalname}`;
    // const avatarURL = path.join('avatars', originalname);
    // fs.rename(tempPath, resultDir);

    // try {
    //     const image = await Jimp.read(tempPath);
    //     image.resize(250, 250);
    //     await image.writeAsync(resultDir);

    //     fs.unlinkSync(tempPath);

    //     await User.findByIdAndUpdate(_id, { avatarURL });
    //     const user = await User.findOne({ email });
    //     if (!user) {
    //         throw HttpError(401, 'Not authorized');
    //     }

    //     res.json({
    //         avatarURL,
    //     });
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).json({
    //         error: 'wrong',
    //     });
    // }
};
    // await User.findByIdAndUpdate(_id, { avatarURL });

    // const user = await User.findOne({ email });
    // if (!user) {
    //     throw HttpError(401, 'Not authorized');
    // }
//     res.json({
//         avatarURL,
//     })
// }

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
}