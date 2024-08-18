const NotFoundError = require("../utils/notFoundError");

class getProductService{
    constructor(productRepository){
        this.productRepository = productRepository;
    }
    async getProd(ids){
         const prod = await this.productRepository.getProductById(ids);
         if(!prod){
            throw new NotFoundError('Product');
        }
        return prod;
    }
    async deleteProd(ids){
        const prod = await this.productRepository.deleteProdById(ids);
        if(!prod){
            throw new NotFoundError('Product');
        }
        return prod;
    }

}

module.exports = getProductService