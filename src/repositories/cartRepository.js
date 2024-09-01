const Cart = require('../schema/cartSchema')
const BadRequestError = require('../utils/badRequestError');
const InternalServerError = require('../utils/internalServerError');
const NotFoundError = require('../utils/notFoundError');
class CartRepository{
    async createCart(userId){
        try {
            const newCart = await Cart.create({
                user: userId
    
            });
    
            return newCart
        }
        catch (error) {
            if(error.name === 'ValidationError'){
                const errorMessageList = Object.keys(error.errors).map(property => {
                    return error.errors[property].message;
                });
        
                if (errorMessageList.length === 0) {
                    errorMessageList.push("Unknown validation error");
                }
    
                throw new BadRequestError(errorMessageList);
            }
            console.log(error)
            throw new InternalServerError();
        }
    
    }
    
    async getCartByUserId(userId){
        try {
            const cart = await Cart.findOne({
                user : userId
            }).populate('items.product');
            return cart;
        } catch (error) {
            console.log(error);
            throw new InternalServerError();
        }
    }

    async clearCart(userId){
        try {
            const cart = await Cart.findOne({
                user : userId
            })
            if(!cart){
                throw new NotFoundError("Cart");
            }
            cart.items = [];
            await cart.save();
            return cart;
        } catch (error) {
            throw new InternalServerError();
        }
    }
    
    
}


module.exports = CartRepository;