const mongoose = require('mongoose');
const ReviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Please provide rating']
    },
    title: {
        type: String,
        trim: true,
        required: [true, 'Please provide title'],
        maxLength: [100, 'Title cannot be more than 100 characters']
    },
    comment: {
        type: String,
        required: [true, 'Please provide comment'],
        maxLength: [1500, 'Comment cannot be more than 1500 characters']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
    }
}, { timestamps: true });

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.statics.calculateAverageRating = async function (productId) {
    // Calculate average rating and number of reviews for the given product
    const result = await this.aggregate([
        { $match: { product: productId } },
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                numOfReviews: { $sum: 1 }
            }
        }
    ]);
    try {
        // Update the product with the calculated average rating and number of reviews
        await this.model('Product').findOneAndUpdate({ _id: productId }, {
            averageRating: Math.ceil(result[0]?.averageRating || 0),
            numOfReviews: result[0]?.numOfReviews || 0
        });
    } catch (error) {
        console.log(error);
    }
};

ReviewSchema.post('save', async function () {
    this.constructor.calculateAverageRating(this.product);
});

ReviewSchema.post('deleteOne',
    { document: true, query: false }, async function () {
        this.constructor.calculateAverageRating(this.product);
    });

module.exports = mongoose.model('Review', ReviewSchema);
