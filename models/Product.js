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
    numOfReviews: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }
});

// Can't query with virtuals in MongoDB !!
ProductSchema.virtual('reviews', {
    // Establishing a relationship between the Product model and the Review model
    ref: 'Review',
    // based on the _id field of the Product model ...
    localField: '_id',
    // and the product field of the Review model
    foreignField: 'product', // Specifies that the foreign field in the "Review" model to match is the product field
    justOne: false, // Specifies that multiple reviews can be associated with a single product
    // match: { rating: 5 } // Only return reviews with a rating of 5
});

ProductSchema.pre(
    "deleteOne",
    { document: true, query: false },
    async function () {
        await this.model("Review").deleteMany({ product: this._id });
    }
);

module.exports = mongoose.model('Product', ProductSchema);
