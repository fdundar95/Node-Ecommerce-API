const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse, createTokenUser, checkPermissions } = require('../utils');

const getAllUsers = async (req, res) => {
    const users = await User.find({ role: 'user' }).select('-password -role -__v');
    res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
    const { id: jobId } = req.params;
    const user = await User.findOne({ _id: jobId }).select('-password -role -__v');

    if (!user) {
        throw new CustomError.NotFoundError(`No user with id: ${jobId}`);
    }

    checkPermissions(req.user, user._id);
    res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        throw new CustomError.BadRequestError('Please provide name and email');
    }

    const user = await User.findOneAndUpdate({ _id: req.user.userId }, req.body, {
        new: true,
        runValidators: true
    });

    attachCookiesToResponse({ res, user: createTokenUser(user) });

    res.status(StatusCodes.OK).json({ msg: 'User updated' });
};

const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError('Please provide old and new password');
    }

    const user = await User.findOne({ _id: req.user.userId });

    const isPasswordCorrect = await user.comparePassword(oldPassword);
    const isPasswordSame = await user.comparePassword(newPassword);
    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Wrong password');
    }
    if (isPasswordSame) {
        throw new CustomError.BadRequestError('New password cannot be same as old password');
    }
    user.password = newPassword;
    await user.save();

    res.status(StatusCodes.OK).json({ msg: 'Password updated' });
};

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
};
