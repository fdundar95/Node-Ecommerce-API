const createTokenUser = (userData) => {
    const { _id, name, role } = userData;
    return { userId: _id, name, role };
};

module.exports = createTokenUser;
