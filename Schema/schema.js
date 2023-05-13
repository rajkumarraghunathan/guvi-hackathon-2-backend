const mongoose = require('mongoose')

const product = new mongoose.Schema({
    productName: {
        type: String,
        trim: true
    },
    productPrice: {
        type: Number,
        trim: true
    },
    productId: {
        type: Number,
        trim: true,
        unique: true
    },
    productImage: {
        type: String,
        trim: true
    }

})

module.exports = mongoose.model('products', product);