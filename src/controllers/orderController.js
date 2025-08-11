const { restaurantLocation } = require("../config/location");
const CartRepository = require("../repositories/cartRepository");
const OrderRepository = require("../repositories/orderRepository");
const UserRepository = require("../repositories/userRepository");
const Order = require("../schema/orderSchema");
const { simulateDriverLocation } = require("../services/locationService");
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
async function changeOrderStatus(req, res) {
    const orderService = new OrderService(new CartRepository(), new UserRepository(), new OrderRepository());
    try {
        const { orderId, status } = req.params;

        const order = await orderService.updateStatusOfOrder(orderId, status);

        // If the new status is 'out_for_delivery', trigger the simulation
        if (status === 'out_for_delivery') {
            console.log(`[Order Controller] Status for order ${orderId} is 'out_for_delivery'. Starting simulation.`);
            
            const io = req.app.get('io'); // Get the socket.io instance from app context
            const fullOrder = await Order.findById(orderId).populate('address');

            // Ensure we have a valid order with address coordinates
            if (fullOrder && fullOrder.address && fullOrder.address.lat && fullOrder.address.lng) {
                const startCoords = restaurantLocation;
                const endCoords = {
                    latitude: fullOrder.address.lat,
                    longitude: fullOrder.address.lng
                };
                
                const roomName = `order_${orderId}`;

                simulateDriverLocation(io, roomName, startCoords, endCoords);
            } else {
                console.error(`[Order Controller] Could not start simulation for order ${orderId}: Missing address details.`);
            }
        }

        res.status(200).json({
            status: true,
            message: "Successfully updated status",
            data: order,
            error: {}
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: "Something went wrong",
            error: error.message
        });
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