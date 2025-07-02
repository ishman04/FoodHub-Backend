const stripe = require("../config/stripe");
const express = require('express');
const Order = require("../schema/orderSchema");
const { handleWebhook } = require("../controllers/paymentController");
const webhookRouter = express.Router();

webhookRouter.post('/',express.raw({type: 'application/json'}), handleWebhook)
module.exports = webhookRouter
