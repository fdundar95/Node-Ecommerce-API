const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse, createTokenUser } = require('../utils');


const register = async (req, res) => {
    const { name, email, password } = req.body;
    const newUser = await User.create({ name, email, password });

    attachCookiesToResponse({ res, user: createTokenUser(newUser) });

    res.status(StatusCodes.CREATED).json({ user: { userId: newUser._id, name: newUser.name, email: newUser.email } });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        throw new CustomError.BadRequestError('Please provide email');
    }
    if (!password) {
        throw new CustomError.BadRequestError('Please provide password');
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }

    const tokenUser = { userId: user._id, name: user.name, role: user.role };
    attachCookiesToResponse({ res, user: createTokenUser(user) });

    res.status(StatusCodes.OK).json({ user: { userId: user._id, name: user.name, email: user.email } });
};

const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
        maxAge: 0
    });
    res.status(StatusCodes.OK).json({ msg: 'user logged out' });
};


module.exports = {
    register,
    login,
    logout
};
