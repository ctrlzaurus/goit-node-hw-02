const ctrlWrapper = require("../utils/ctrlWrapper");
const { User } = require('../models/user');
const HttpError = require("../services/HttpError");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;


const register = async(req, res) => {
    const { password, email } = req.body;

    const user = await User.findOne({ email })
    if(user) {
        throw HttpError(409, 'Email in use')
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ email, password: hashedPassword });

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
    const { email } = req.user;

    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, 'Not authorized');
    }

    res.json({
        email,
        subscription: user.subscription,
    })
}

const logout = async (req, res) => {
    const { _id: id } = req.user;
    await User.findByIdAndUpdate(id, {token: ''});
    res.status(204).send();
}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
}