const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product',
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }   
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["ordered","delivered"],
        default: "ordered"
    },
    address: {
        type: String,
        required: true,
        ref: 'User'
    },
    paymentMethod: {
        type: String,
        enum: ["online","cash"],
        default: "cash"
    }
},{timestamps:true})

const Order = mongoose.model("Order",orderSchema);
module.exports = Order;