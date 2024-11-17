const Product = require('../schema/productSchema');
const BadRequestError = require('../utils/badRequestError');
const InternalServerError = require('../utils/internalServerError');

class ProductRepository{
    async createProduct(productDetails){
        try {
            const product = new Product(productDetails)
            return await product.save();
        } catch (error) {
            if(error.name === 'ValidationError'){
                const errorMessageList = Object.keys(error.errors).map((property) => { //error has a property named errors
                    return error.errors[property].message;
                });

                throw new BadRequestError(errorMessageList);
            }
            console.log(error)
            throw new InternalServerError();
        }
    }
    async getProductById(ids){
        try {
            const prod = await Product.findById(ids);
            return prod;
        } catch (error) {
            console.log(error);
            throw new InternalServerError();
        }
    }
    async getAllProducts(){
        try {
            const prods = await Product.find({});
            return prods;
        } catch (error) {
            console.log(error);
            throw new InternalServerError();
        }
    }
    async deleteProdById(ids){
        try {
            const prod = await Product.findByIdAndDelete(ids);
            return prod;
        } catch (error) {
            console.log(error);
            throw new InternalServerError();
        }
    }
}

module.exports = ProductRepository