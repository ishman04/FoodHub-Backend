const Product = require('../schema/productSchema')

class ProductRepository{
    async createProduct(productDetails){
        try {
            const product = new Product(productDetails)
            return await product.save();
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = ProductRepository