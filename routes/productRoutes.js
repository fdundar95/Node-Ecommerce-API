const router = require('express').Router();
const {
    getAllProducts,
    getSingleProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage
} = require('../controllers/productController');
const { getSingleProductReviews } = require('../controllers/reviewController');
const { authorizePermissions, authenticateUser } = require('../middleware/authentication');


router.route('/')
    .get(getAllProducts)
    .post(authenticateUser, authorizePermissions('admin', 'owner'), createProduct);
router.route('/:id')
    .get(getSingleProduct)
    .put(authenticateUser, authorizePermissions('admin', 'owner'), updateProduct)
    .delete(authenticateUser, authorizePermissions('admin', 'owner'), deleteProduct);
router.route('/uploadImage')
    .post(authenticateUser, authorizePermissions('admin', 'owner'), uploadImage);
router.route('/:id/reviews').get(getSingleProductReviews);

module.exports = router;
