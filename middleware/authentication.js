const customError = require('../errors');
const { isTokenValid } = require('../utils');
const { UnauthorizedError } = require('../errors');

const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token;
    if (!token) {
        throw new customError.UnauthenticatedError('Authentication invalid');
    }
    try {
        const { payload: user } = isTokenValid(token);
        req.user = user;
    } catch (error) {
        console.log('Error:', error);
        throw new customError.UnauthenticatedError('Authentication invalid');
    }
    next();
};

const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new UnauthorizedError('Unauthorized to access this route');
        }
        next();
    };
};

module.exports = {
    authenticateUser,
    authorizePermissions
};
