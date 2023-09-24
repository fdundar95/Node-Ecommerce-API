const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

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

    res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
    res.send('Show current user');
};

const updateUser = async (req, res) => {
    res.send('Update user');
};

const updateUserPassword = async (req, res) => {
    res.send('Update user password');
};

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
};
