const express = require('express');
const { isLoggedIn } = require('../validation/authValidator');
const {
  checkDeliveryRadius,
  setExactAddress,
  getUserAddresses
} = require('../controllers/deliveryController');

const deliveryRouter = express.Router();

deliveryRouter.post('/check-radius', isLoggedIn, checkDeliveryRadius);
deliveryRouter.post('/create-address', isLoggedIn, setExactAddress);
deliveryRouter.get('/user-addresses', isLoggedIn, getUserAddresses); // ✅ new route

module.exports = deliveryRouter;
