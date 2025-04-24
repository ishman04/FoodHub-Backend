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
                { $group: {                                      // Group orders by user
                    _id: "$user",                                // _id will be user's ObjectId
                    totalOrdersValue: { $sum: "$totalPrice" }        // Sum the total price of orders
                }},
                { $sort: { totalOrdersValue: -1 } },                   // Sort by totalOrders in descending order
                { $limit: 5 },                                   // Limit to the top 5 customers
                { $lookup: {                                     // Join with 'users' collection to get user details
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                }},
                { $unwind: "$userDetails" },                      // Unwind the userDetails array
                { $project: {                                    // Project fields
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
