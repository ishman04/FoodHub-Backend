
const AppError = require("../utils/appError");
const BadRequestError = require("../utils/badRequestError");
const NotFoundError = require("../utils/notFoundError");

class CartService{
    constructor(cartRepository,productRepository){
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }
    async getCart(userId){
        const cart = await this.cartRepository.getCartByUserId(userId)
        if(!cart){
            throw new NotFoundError("Cart");
        }
        return cart;
    }

    async modifyCart(userId, productId, shouldAdd) {
        const cart = await this.cartRepository.getCartByUserId(userId);
        if (!cart) {
            throw new NotFoundError("Cart");
        }

        const product = await this.productRepository.getProductById(productId);
        if (!product) {
            throw new NotFoundError("Product");
        }

        if (shouldAdd && (!product.inStock || product.quantity <= 0)) {
            throw new AppError("Product not in stock",400);
        }

        let foundProduct = false;
        if ((cart.items).length !== 0) {
            cart.items.forEach((prod) => {
                if (prod.product._id == productId) {
                    foundProduct = true;
                    if (shouldAdd) {
                        if (product.quantity >= 1) {
                            prod.quantity += 1;
                            cart.totalPrice += product.price;
                            product.quantity -= 1;
                        } else {
                            throw new AppError("The quantity of the product requested is not available", 404);
                        }
                    } else {
                        if (prod.quantity > 0) {
                            prod.quantity -= 1;
                            cart.totalPrice -= product.price;
                            product.quantity += 1;
                            if (prod.quantity === 0) {
                                // Mark the product for removal
                                prod._remove = true;
                            }
                        } else {
                            throw new AppError("Quantity of the item requested is not available", 404);
                        }
                    }
                }
            });
    
            // Remove items marked for removal
            cart.items = cart.items.filter((prod) => !prod._remove);
        }
       

        if (shouldAdd && !foundProduct) {
            if (product.quantity <= 0) {
                throw new AppError("Product not in stock");
            }
            cart.items.push({
                product: productId,
                quantity: 1
            });
            product.quantity -= 1;
            cart.totalPrice += product.price;
        } else if (!shouldAdd && !foundProduct) {
            throw new NotFoundError("Product in the cart");
        }

        await cart.save();
        await product.save();
        return cart;
    }

    async removeItemsFromCart(userId){
        const response = await this.cartRepository.clearCart(userId);
        return response;
    }

}

module.exports = CartService;