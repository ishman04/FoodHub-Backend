const express = require('express');
const { createPaymentIntent } = require('../controllers/paymentController');
const {isLoggedIn} = require('../validation/authValidator');

const paymentRouter = express.Router();

paymentRouter.post('/create-payment-intent',isLoggedIn,createPaymentIntent)


module.exports = paymentRouter