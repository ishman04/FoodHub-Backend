const ProductRepository = require("../repositories/productRepository")
const ProductService = require("../services/productService");
const AppError = require("../utils/appError");

async function createProd(req,res){
    try {
        const products = new ProductService(new ProductRepository);

        const productDetails = await products.createProduct({
            name: req.body.name,
            description: req.body.description,
            imagePath: req.file?.path, 
            price: req.body.price,
            category: req.body.category,
            inStock: req.body.inStock

        })
        return res.json({
            success: true,
            message: "Product created successfully",
            data: productDetails,
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
                message: error.reason,
                data: {},
                error: error
            })
        }
    }
    
}

module.exports = createProd