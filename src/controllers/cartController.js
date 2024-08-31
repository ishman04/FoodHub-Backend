const model = require('mongoose')
const CartService = require('../services/cartService')
const CartRepository = require('../repositories/cartRepository');
const AppError = require('../utils/appError');
const ProductRepository = require('../repositories/productRepository');
async function getCartByUser(req,res){
    const carts = new CartService(new CartRepository, new ProductRepository);
    try {
        const cart = await carts.getCart(req.user.id);
        res.status(200).json({
            status: true,
            message: "Successfully fetched cart",
            data: cart,
            error: {}
        })   
    } catch (error) {
        console.log(error);
        if(error instanceof AppError){
            res.status(error.statusCode).json({
                status: false,
                message: error.message,
                data: {},
                error: error
            })
        }
        else{
            res.status(500).json({
                status: false,
                message: "Something went wrong",
                data: {},
                error: error
            })
        }
    }
     
}

async function modifyProductToCart(req,res){
    const carts = new CartService(new CartRepository, new ProductRepository);
    try {
        const cart = await carts.modifyCart(req.user.id,req.params.productId,req.params.operation=="add");
        res.status(200).json({
            status: true,
            message: "Successfully added product to cart",
            data: cart,
            error: {}
        })   
    } catch (error) {
        console.log(error);
        if(error instanceof AppError){
            res.status(error.statusCode).json({
                status: false,
                message: error.message,
                data: {},
                error: error
            })
        }
        else{
            res.status(500).json({
                status: false,
                message: "Something went wrong",
                data: {},
                error: error
            })
        }
    }
     
}

module.exports = {
    getCartByUser,
    modifyProductToCart
}