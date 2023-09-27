const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide product name'],
        trim: true,
        maxlength: [100, 'Product name cannot be more than 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please provide product price'],
        default: 0
    },
    description: {
        type: String,
        required: [true, 'Please provide product description'],
        maxlength: [1000, 'Product description cannot be more than 1000 characters']
    },
    image: {
        type: String,
        default: '/images/default.png'
    },
    category: {
        type: String,
        required: [true, 'Please provide product category'],
        enum: ['Time-Travel Gadgets', 'Steampunk Wonders', 'Historical Fashion', 'Quantum Curiosities']
    },
    company: {
        type: String,
        required: [true, 'Please provide product company'],
        enum: {
            values: ['ChronoTech Ltd', 'EonVision Corp', 'QuantaCraft', 'EpochWear Inc.'],
            message: '{VALUE} is not supported'
        }
    },
    colors: {
        type: [String],
        required: true,
        default: ['#222']
    },
    featured: {
        type: Boolean,
        default: false
    },
    shipping: {
        type: Boolean,
        default: false
    },
    stock: {
        type: Number,
        required: true,
        default: 15
    },
    stars: {
        type: Number,
        default: 0
    },
    reviews: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);
