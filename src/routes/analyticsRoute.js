const express = require('express');
const { getTopProducts } = require('../controllers/analyticsController');

const analyticsRouter = express.Router();

analyticsRouter.get('/top-products', getTopProducts);

module.exports = analyticsRouter;
