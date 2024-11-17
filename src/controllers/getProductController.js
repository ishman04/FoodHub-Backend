const ProductRepository = require("../repositories/productRepository");
const getProductService = require("../services/getProdService");
const AppError = require("../utils/appError");

async function getProduct(req,res){
    const product = new getProductService(new ProductRepository)
    const ids = req.params.id
    try {
        const prod = await product.getProd(ids);
        res.status(200).json({
            success: true,
            message: "Product found",
            data: prod,
            error: {}
        })    
    } catch (error) {
        if(error instanceof AppError){
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
                data: {},
                error: error
            })    
        }
        else{
            res.status(500).json({
                success: false,
                message: 'Could not find the product',
                data: {},
                error: error
            })
        }
        

    }
    

}

async function getProducts(req,res){
    const product = new getProductService(new ProductRepository)

    try {
        const prod = await product.getAllProductsData();
        res.status(200).json({
            success: true,
            message: "Product found",
            data: prod,
            error: {}
        })    
    } catch (error) {
        if(error instanceof AppError){
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
                data: {},
                error: error
            })    
        }
        else{
            res.status(500).json({
                success: false,
                message: 'Could not find the product',
                data: {},
                error: error
            })
        }
        

    }
    

}

async function DeleteProduct(req,res){
    const product = new getProductService(new ProductRepository)
    const ids = req.params.id
    try {
        const prod = await product.deleteProd(ids)
        res.json({
            status: 200,
            message: "Product deleted",
            data: prod,
            error: {}
        })    
    } catch (error) {
        if(error instanceof AppError){
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
                data: {},
                error: error
            })    
        }
        else{
            res.status(500).json({
                success: false,
                message: 'Could not be deleted',
                data: {},
                error: error
            })
            console.log(error)
        }
        

    }
    

}

module.exports = {
    getProduct,
    DeleteProduct,
    getProducts
}

