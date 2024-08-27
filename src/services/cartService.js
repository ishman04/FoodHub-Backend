const NotFoundError = require("../utils/notFoundError");

class CartService{
    constructor(cartRepository){
        this.cartRepository = cartRepository;
    }
    async getCart(userId){
        const cart = await this.cartRepository.getCartByUserId(userId)
        if(!cart){
            throw new NotFoundError("Cart");
        }
        return cart;
    }
}

module.exports = CartService;