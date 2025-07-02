const express = require('express');
const { creatingANewOrder, getAllOrders, getOrder, cancelOrder, changeOrderStatus, getAllPendingOrders, getDeliveredOrdersForAdmin } = require('../controllers/orderController');
const { isLoggedIn, isAdmin } = require('../validation/authValidator');

const orderRouter = express.Router();

orderRouter.post('/create',isLoggedIn,creatingANewOrder);
orderRouter.get('/',isLoggedIn,getAllOrders);
orderRouter.get('/:orderId',isLoggedIn,getOrder);
orderRouter.put('/cancel/:orderId',isLoggedIn,cancelOrder);
orderRouter.patch('/update/:orderId/:status',isLoggedIn,isAdmin,changeOrderStatus);
orderRouter.get('/admin/pending-orders',isLoggedIn,isAdmin,getAllPendingOrders)
orderRouter.get('/admin/delivered-orders',isLoggedIn,isAdmin,getDeliveredOrdersForAdmin)

module.exports=orderRouter;