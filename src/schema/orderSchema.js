const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                require: true,
                ref: 'Product'
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
        enum: ["ordered","cancelled","processing","out_for_delivery","cancelled"],
        default: "ordered"
    },
    address: {
        type: String,
        minLength: [10,"Address should be atleast 10 characters"]
    },
    paymentMethod: {
        type: String,
        enum: ["online","cash"],
        default: "cash"
    }
},{timestamps:true})

const Order = mongoose.model("Order",orderSchema);
module.exports = Order;