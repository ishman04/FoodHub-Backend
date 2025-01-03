const Order = require("../schema/orderSchema");
const BadRequestError = require("../utils/badRequestError");
const InternalServerError = require("../utils/internalServerError");

class OrderRepository{
    async createNewOrder(order){
        try {
            const newOrder = await Order.create(order);
            return newOrder;
        } 
        catch (error) {
            if(error.name === 'ValidationError'){
                const errorMessageList = Object.keys(error.errors).map(property => {
                    return error.errors[property].message;
                });
        
                if (errorMessageList.length === 0) {
                    errorMessageList.push("Unknown validation error");
                }
    
                throw new BadRequestError(errorMessageList);
            }
            console.log(error)
            throw new InternalServerError();
        }

    }
    async getOrdersByUserId(userId){
        try {
            const order = await Order.find({user:userId}).populate('items.product');
            return order;
        } catch (error) {
            console.log(error);
            throw new InternalServerError();
        }
    }
    async getOrderById(orderId){
        try {
            const order = await Order.findById(orderId).populate('items.product');
            return order;
        } catch (error) {
            console.log(error);
            throw new InternalServerError();
        }
    }
    async updateOrderStatus(orderId,status){
        try {
            const order = await Order.findByIdAndUpdate(orderId,{status:status},{
                new:true,
            });
            return order;
        } catch (error) {
            console.log(error);
            throw new InternalServerError();  
        } 
    }

    async findPendingOrders() {
        try {
            const pendingOrders = await Order.find({ status: 'ordered' }).populate('user', 'firstName email');
            return pendingOrders;
        } catch (error) {
            console.error('Error in findPendingOrders:', error); // Add a detailed log
            throw new InternalServerError('Error fetching pending orders from database');
        }
    }
}
module.exports = OrderRepository;