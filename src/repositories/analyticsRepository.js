const Order = require('../schema/orderSchema');

class AnalyticsRepository {
    async getTopProducts() {
        const result = await Order.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.product",
                    totalSold: { $sum: "$items.quantity" }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            { $unwind: "$productDetails" },
            {
                $project: {
                    _id: 0,
                    productId: "$productDetails._id",
                    name: "$productDetails.name",
                    category: "$productDetails.category",
                    price: "$productDetails.price",
                    totalSold: 1
                }
            }
        ]);

        return result;
    }
    async getTopCustomers() {
        try {
            const topCustomers = await Order.aggregate([
                { $group: {                                      
                    _id: "$user",                                
                    totalOrdersValue: { $sum: "$totalPrice" }        
                }},
                { $sort: { totalOrdersValue: -1 } },                   
                { $limit: 5 },                                 
                { $lookup: {                                   
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                }},
                { $unwind: "$userDetails" },                      
                { $project: {                                    
                    _id: 0,
                    userId: "$_id",
                    firstName: "$userDetails.firstName",
                    lastName: "$userDetails.lastName",
                    totalOrdersValue: 1
                }}
            ]);
            return topCustomers;
        } catch (error) {
            throw new Error("Error while fetching top customers: " + error.message);
        }
    }
}

module.exports = AnalyticsRepository;
