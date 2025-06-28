const express = require('express');
const { isLoggedIn } = require('../validation/authValidator');
const checkDeliveryRadius = require('../controllers/deliveryController');



const deliveryRouter = express.Router();

deliveryRouter.post('/check-radius', isLoggedIn,checkDeliveryRadius);

module.exports = deliveryRouter