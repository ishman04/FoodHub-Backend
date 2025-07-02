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
        enum: ["ordered","preparing","out_for_delivery","delivered"],
        default: "ordered"
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Address'
    },
    paymentMethod: {
        type: String,
        enum: ["card","cash"],
        default: "cash"
    },
    paymentIntentId: String,
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: Date
},{timestamps:true})

const Order = mongoose.model("Order",orderSchema);
module.exports = Order;