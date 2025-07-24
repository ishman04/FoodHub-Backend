const cloudinary = require('../config/cloudinaryConfig')
const fs = require('fs/promises')
const InternalServerError = require('../utils/internalServerError')
class ProductService{
    constructor(productRepository){
        this.productRepository = productRepository
    }
    async createProduct(productDetails){
    const product = await this.productRepository.createProduct({
        ...productDetails,
        productImage: productDetails.imagePath || undefined // Cloudinary URL directly
    });

    if (!product) {
        throw { reason: 'Product not created', statusCode: 500 };
    }
    return product; 
}

      
}

module.exports = ProductService
