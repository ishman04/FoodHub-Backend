const CartRepository = require("../repositories/cartRepository");
const OrderRepository = require("../repositories/orderRepository");
const UserRepository = require("../repositories/userRepository");
const OrderService = require("../services/orderService");
const AppError = require("../utils/appError");

async function creatingANewOrder(req,res){
    const obj = new OrderService(new CartRepository,new UserRepository,new OrderRepository)
    try {
        const order = await obj.createOrder(req.user.id,req.body);
        res.status(200).json({
            status: true,
            message: "Successfully created order",
            data: order,
            error: {}
        })   
    } catch (error) {
        console.log(error);
        if(error instanceof AppError){
            res.status(error.statusCode).json({
                status: false,
                message: error.message,
                data: {},
                error: error
            })
        }
        else{
            res.status(500).json({
                status: false,
                message: "Something went wrong",
                data: {},
                error: error
            })
        }
    }
    
}
async function getAllOrders(req,res){
    const obj = new OrderService(new CartRepository,new UserRepository,new OrderRepository);
    try {
        const order = await obj.getAllOrdersCreatedByUser(req.user.id);
        res.status(200).json({
            status: true,
            message: "Successfully fetched orders",
            data: order,
            error: {}
        })   
    } catch (error) {
        console.log(error);
        if(error instanceof AppError){
            res.status(error.statusCode).json({
                status: false,
                message: error.message,
                data: {},
                error: error
            })
        }
        else{
            res.status(500).json({
                status: false,
                message: "Something went wrong",
                data: {},
                error: error
            })
        }
    }

}

async function getOrder(req,res){
    const obj = new OrderService(new CartRepository,new UserRepository,new OrderRepository);
    try {
        console.log(req.params.orderId)
        const order = await obj.getOrderDetailsById(req.params.orderId);
        res.status(200).json({
            status: true,
            message: "Successfully fetched order",
            data: order,
            error: {}
        })   
    } catch (error) {
        console.log(error);
        if(error instanceof AppError){
            res.status(error.statusCode).json({
                status: false,
                message: error.message,
                data: {},
                error: error
            })
        }
        else{
            res.status(500).json({
                status: false,
                message: "Something went wrong",
                data: {},
                error: error
            })
        }
    }

}
async function cancelOrder(req,res){
    const obj = new OrderService(new CartRepository,new UserRepository,new OrderRepository);
    try {
        console.log(req.params.orderId)
        const order = await obj.updateStatusOfOrder(req.params.orderId,"cancelled");
        res.status(200).json({
            status: true,
            message: "Successfully cancelled order",
            data: order,
            error: {}
        })   
    } catch (error) {
        console.log(error);
        if(error instanceof AppError){
            res.status(error.statusCode).json({
                status: false,
                message: error.message,
                data: {},
                error: error
            })
        }
        else{
            res.status(500).json({
                status: false,
                message: "Something went wrong",
                data: {},
                error: error
            })
        }
    }

}
async function changeOrderStatus(req,res){
    const obj = new OrderService(new CartRepository,new UserRepository,new OrderRepository);
    try {
        const order = await obj.updateStatusOfOrder(req.params.orderId,req.params.status);
        res.status(200).json({
            status: true,
            message: "Successfully updated status",
            data: order,
            error: {}
        })   
    } catch (error) {
        console.log(error);
        if(error instanceof AppError){
            res.status(error.statusCode).json({
                status: false,
                message: error.message,
                data: {},
                error: error
            })
        }
        else{
            res.status(500).json({
                status: false,
                message: "Something went wrong",
                data: {},
                error: error
            })
        }
    }

}

async function getAllPendingOrders(req,res){
    const orderService = new OrderService(
        new CartRepository(),
        new UserRepository(),
        new OrderRepository()
    );

    try {
        const pendingOrders = await orderService.fetchAllPendingOrders();
        res.status(200).json({
            success: true,
            data: pendingOrders,
        });
    } catch (error) {
        console.error('Error in getAllPendingOrders:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch pending orders',
        });
    }
}

async function getDeliveredOrdersForAdmin(req,res){
    const orderService = new OrderService(
        new CartRepository(),
        new UserRepository(),
        new OrderRepository()
    );

    try {
        const Orders = await orderService.AllOrders();
        res.status(200).json({
            success: true,
            data: Orders,
        });
    } catch (error) {
        console.error('Error in All Orders:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch all orders',
        });
    }
}
module.exports = {
    creatingANewOrder,
    getAllOrders,
    getOrder,
    cancelOrder,
    changeOrderStatus,
    getAllPendingOrders,
    getDeliveredOrdersForAdmin
}