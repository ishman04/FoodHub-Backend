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
}

module.exports = AnalyticsRepository;
