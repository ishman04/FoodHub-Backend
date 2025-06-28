const AppError = require("../utils/appError");
const BadRequestError = require("../utils/badRequestError");
const InternalServerError = require("../utils/internalServerError");
const NotFoundError = require("../utils/notFoundError");

class OrderService{
    constructor(cartRepository,userRepository,orderRepository){
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }
    async createOrder(userId,orderDetails){
        const user = await this.userRepository.findUser({_id:userId});
        const cart = await this.cartRepository.getCartByUserId(userId);
        if(!user){
            throw new NotFoundError("User");
        }
        if(!cart){
            throw new NotFoundError("Cart");
        }
        if(cart.items.length===0){
            throw new AppError("Cart is empty",400);
        }
        const order = {};
        order.user = cart.user;
        order.items= cart.items.map(cartItem=>{
            return {
                product:cartItem.product,
                quantity:cartItem.quantity
            }
        });
        order.status = "ordered";
        order.totalPrice = cart.totalPrice;
        
        order.address = orderDetails.address;
        order.paymentMethod = orderDetails.paymentMethod;

        const response = await this.orderRepository.createNewOrder(order);

        if(!response){
            throw new InternalServerError();
        }
        return response;
    }
    async getAllOrdersCreatedByUser(userId){
        const order = await this.orderRepository.getOrdersByUserId(userId)
        if(!order){
            throw new NotFoundError("Orders");
        }    
        return order;
    }
    async getOrderDetailsById(orderId){
        const order = await this.orderRepository.getOrderById(orderId) 
        if(!order){
            throw new NotFoundError("Order");
        }    
        return order;
    }
    async updateStatusOfOrder(orderId,status){
        const order = await this.orderRepository.updateOrderStatus(orderId,status);
        if(!order){
            throw new NotFoundError("Order");
        }
        return order;
    }

    async fetchAllPendingOrders(){
        try {
            const orders = await this.orderRepository.findPendingOrders();
            return orders;
        } catch (error) {
            throw new Error('Error fetching pending orders')
        }
    }
}

module.exports = OrderService