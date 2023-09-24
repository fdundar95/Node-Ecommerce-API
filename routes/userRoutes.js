const router = require('express').Router();
const {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
} = require('../controllers/userController');
const { authorizePermissions } = require('../middleware/authentication');

router.route('/').get(authorizePermissions('admin', 'owner'), getAllUsers);
router.route('/me').get(showCurrentUser);
router.route('/updateUser').patch(updateUser);
router.route('/updateUserPassword').patch(updateUserPassword);
router.route('/:id').get(getSingleUser);

module.exports = router;
