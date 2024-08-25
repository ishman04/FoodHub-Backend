const express = require('express')
const createProd = require('../controllers/productController')
const uploader = require('../middlewares/multerMiddleware')
const {getProduct, DeleteProduct} = require('../controllers/getProductController')
const { isLoggedIn, isAdmin } = require('../validation/authValidator')


const productRouter = express.Router()

productRouter.post('/create',isLoggedIn,isAdmin,uploader.single('imagepath'), createProd) //multer middleware which handles the file upload process. It parses the incoming request and stores the uploaded file on the server temporarily. The uploader middleware extracts the image file from the request and adds its details to req.file.
productRouter.get('/:id',getProduct);
productRouter.delete('/:id',DeleteProduct)

module.exports = productRouter