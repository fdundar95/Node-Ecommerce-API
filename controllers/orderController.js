const Order = require('../models/Order');
const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');

const fakeStripeAPI = async ({ amount, currency }) => {
    const client_secret = 'sk_test_123';
    return { client_secret, amount };
};

const createOrder = async (req, res) => {
    const { items: cartItems, tax, shippingFee } = req.body;
    if (!cartItems || cartItems.length === 0) {
        throw new CustomError.BadRequestError('No cart items');
    }
    if (!tax || !shippingFee) {
        throw new CustomError.BadRequestError('Please provide tax and shipping fee');
    }
    let orderItems = [];
    let subtotal = 0;

    // Loop through each cart item
    for (const item of cartItems) {
        // Find the product in the database
        const dbProduct = await Product.findOne({ _id: item.product });
        if (!dbProduct) {
            throw new CustomError.NotFoundError(`No product with id: ${item.product}`);
        }
        const { name, price, image, _id } = dbProduct;
        // Create a single order item to add to the order
        const singleOrderItem = {
            amount: item.amount,
            name,
            price,
            image,
            product: _id
        };
        // Add the single order item to the orderItems array
        orderItems.push(singleOrderItem);
        // Calculate subtotal
        subtotal += item.amount * price;
    }
    // Calculate total
    const total = subtotal + tax + shippingFee;
    // Get client secret
    const paymentIntent = await fakeStripeAPI({
        amount: total,
        currency: 'usd'
    });
    // Create the order in the database
    const order = await Order.create({
        orderItems,
        total,
        subtotal,
        tax,
        shippingFee,
        clientSecret: paymentIntent.client_secret,
        user: req.user.userId
    });
    res.status(StatusCodes.CREATED).json({ order });
};

const getAllOrders = async (req, res) => {
    const orders = await Order.find({});
    res.status(StatusCodes.OK).json({ orders });
};

const getSingleOrder = async (req, res) => {
    const { id: orderId } = req.params;
    const order = await Order.findOne({ _id: orderId });
    if (!order) {
        throw new CustomError.NotFoundError('No order found');
    }
    checkPermissions(req.user, order.user);

    res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user.userId });
    res.status(StatusCodes.OK).json({ orders });
};

const updateOrder = async (req, res) => {
    const { id: orderId } = req.params;
    const { paymentIntentId } = req.body;

    const order = await Order.findOne({ _id: orderId });
    if (!order) {
        throw new CustomError.NotFoundError('No order found');
    }
    
    checkPermissions(req.user, order.user);

    order.paymentIntentId = paymentIntentId;
    order.status = 'paid';
    await order.save();
};

module.exports = {
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    createOrder,
    updateOrder
};
