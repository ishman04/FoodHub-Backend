const express = require('express');
const { creatingANewOrder, getAllOrders, getOrder, cancelOrder, changeOrderStatus, getAllPendingOrders } = require('../controllers/orderController');
const { isLoggedIn, isAdmin } = require('../validation/authValidator');

const orderRouter = express.Router();

orderRouter.post('/create',isLoggedIn,creatingANewOrder);
orderRouter.get('/',isLoggedIn,getAllOrders);
orderRouter.get('/:orderId',isLoggedIn,getOrder);
orderRouter.put('/cancel/:orderId',isLoggedIn,cancelOrder);
orderRouter.put('/update/:orderId/delivered',isLoggedIn,isAdmin,changeOrderStatus);
orderRouter.get('/admin/pending-orders',isLoggedIn,isAdmin,getAllPendingOrders)

module.exports=orderRouter;