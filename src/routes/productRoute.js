const express = require('express')
const createProd = require('../controllers/productController')
const uploader = require('../middlewares/multerMiddleware')

const productRouter = express.Router()

productRouter.post('/create',uploader.single('imagepath'),createProd)

module.exports = productRouter