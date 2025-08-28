const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            maxlength: 160,
        },
        slug: {
            type: String,
            unique: true,
            index: true,
        },
        image: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 5000,
        },
        priceCents: {
            type: Number,
            requied: true,
            min: 0,
        },
        countInStock: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
    },
    {timestamps: true, toJSON: { getters: true }, toObject: { getters: true }}
);

module.exports = mongoose.model('Product', ProductSchema);