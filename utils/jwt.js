const jwt = require('jsonwebtoken');

const createJWT = ({ payload }) => {
    return jwt.sign({ payload }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME
    });
};

const isTokenValid = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

const attachCookiesToResponse = ({ res, userId }) => {
    const token = createJWT({ userId });

    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        secure: process.env.NODE_ENV === 'production',
        signed: true
    });
};

module.exports = {
    createJWT,
    isTokenValid,
    attachCookiesToResponse
};
