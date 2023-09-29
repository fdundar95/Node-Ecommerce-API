const CustomError = require('../errors');

const checkPermissions = (requestUser, resourceUserId) => {
    const isAdmin = requestUser.role === 'admin';
    const isAuthorized = requestUser.userId === resourceUserId.toString();
    if (isAdmin || isAuthorized) {
        return;
    }

    throw new CustomError.UnauthorizedError('Not authorized to access this route');
};

module.exports = checkPermissions;
