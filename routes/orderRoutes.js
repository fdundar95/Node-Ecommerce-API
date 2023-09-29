const router = require('express').Router();
const {
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    createOrder,
    updateOrder
} = require('../controllers/orderController');
const { authorizePermissions } = require('../middleware/authentication');

router.route('/').get(authorizePermissions('admin', 'owner'), getAllOrders).post(createOrder);
router.route('/myOrders').get(getCurrentUserOrders);
router.route('/:id').get(getSingleOrder).patch(updateOrder);

module.exports = router;
