const express = require('express');
const { getTopProducts,getTopCustomers } = require('../controllers/analyticsController');

const analyticsRouter = express.Router();

analyticsRouter.get('/top-products', getTopProducts);
analyticsRouter.get('/top-customers', getTopCustomers);

module.exports = analyticsRouter;
