const cloudinary = require('../config/cloudinaryConfig')
const fs = require('fs/promises')
const InternalServerError = require('../utils/internalServerError')
class ProductService{
    constructor(productRepository){
        this.productRepository = productRepository
    }
    async createProduct(productDetails){
        // 1. check if productImage comes in this object, if yes then upload this on cloudinary
        // 2. using this url and other details upload it in db

        if(productDetails.imagePath){
            try {
                const cloudinaryResponse = await cloudinary.uploader.upload(productDetails.imagePath)
                var productImage = cloudinaryResponse.secure_url
                await fs.unlink(process.cwd() + '/'+productDetails.imagePath) //process.cwd returns root directory path
            } catch (error) {
                    console.log("Error while uploading image to cloudinary: ", error)
                    throw new InternalServerError();
            }
        }
        const product = await this.productRepository.createProduct({
            ...productDetails,
            productImage: productImage || undefined
        })
        if(!product){
            throw {reason: 'Product not created',statusCode: 500}
        }
        return product; 
    }
      
}

module.exports = ProductService
