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
    async getAllProductsData(){
        const prods = await this.productRepository.getAllProducts();
         if(!prods){
            throw new NotFoundError('Product');
        }
        return prods;
    }

}

module.exports = getProductService