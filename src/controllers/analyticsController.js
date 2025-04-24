const AnalyticsService = require('../services/analyticsService');
const AnalyticsRepository = require('../repositories/analyticsRepository');

async function getTopProducts(req, res) {
    const analyticsService = new AnalyticsService(new AnalyticsRepository());

    try {
        const topProducts = await analyticsService.getTopProducts();
        return res.status(200).json({
            success: true,
            message: 'Top 5 best-selling products',
            data: topProducts,
            error: {}
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error',
            data: {},
            error
        });
    }
}
async function getTopCustomers(req, res) {
    const analyticsService = new AnalyticsService(new AnalyticsRepository());
    try {
        const topCustomers = await analyticsService.getTopCustomers();
        return res.status(200).json({
            message: "Top customers fetched successfully",
            data: topCustomers,
            error: {}
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message,
            data: {},
            error: error
        });
    }
}

module.exports = { getTopProducts,getTopCustomers };
