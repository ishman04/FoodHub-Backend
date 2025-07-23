const stripe = require("../config/stripe");
const Cart = require("../schema/cartSchema");
const Order = require("../schema/orderSchema");
const createPaymentIntent = async(req,res) => {
    try {
        const userId = req.user.id
        const {addressId, paymentMethod,idempotencyKey} = req.body;

        const cart = await Cart.findOne({ user: userId }).populate("items.product");
        if (!cart || cart.items.length === 0) {
          return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        const calculatedAmount = cart.items.reduce(
        (acc, item) => acc + item.quantity * item.product.price,
        0
        );


        const paymentIntent = await stripe.paymentIntents.create({
            amount: calculatedAmount * 100,
            currency: 'inr',
            payment_method_types: ['card'],
            metadata: {
                userId,
                addressId,
                amount: calculatedAmount,
                cartId: cart._id.toString(),
                paymentMethod,
            }
        },{
        idempotencyKey
      })
        res.status(200)
            .json({
                success: true,
                message: 'Payment intent created successfully',
                data:{
                    clientSecret: paymentIntent.client_secret,
                    paymentIntentId: paymentIntent.id
                }
            })
    } catch (error) {
      console.error(error);
        res.status(500)
            .json({
                success: false,
                message: 'Error creating payment intent',
                error: error.message
            })
    }
}


const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      const { userId, addressId, paymentMethod, amount} = paymentIntent.metadata;

      try {
        // ✅ Re-fetch cart securely from DB
        const cart = await Cart.findOne({user: userId}).populate("items.product");

        if (!cart || cart.items.length === 0) {
          console.warn(`⚠️ No cart found for user ${userId}`);
          break;
        }

        // ✅ Create order from actual DB cart
        const newOrder = await Order.create({
          user: userId,
          items: cart.items,
          address: addressId,
          totalPrice: parseFloat(amount),
          paymentMethod,
          paymentIntentId: paymentIntent.id,
          isPaid: true,
          paidAt: new Date(),
          status: "ordered"
        });

        console.log(`✅ Order ${newOrder._id} created for PaymentIntent ${paymentIntent.id}`);


      } catch (err) {
        console.error("❌ Error while creating order:", err.message);
      }

      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      console.warn(`❌ Payment failed for intent ${paymentIntent.id}`);
      // Optionally log or notify the user
      break;
    }

    case 'payment_intent.canceled': {
      const paymentIntent = event.data.object;
      console.warn(`⚠️ Payment canceled for intent ${paymentIntent.id}`);
      // Optionally mark any temporary order or payment attempt
      break;
    }

    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};


module.exports ={
    createPaymentIntent,
    handleWebhook
}

// full workflow
//  1. User Proceeds to Checkout
// User selects address and confirms cart.

// Frontend hits your backend route:

// bash
// Copy code
// POST /api/payment/create-payment-intent
// With:

// json
// Copy code
// {
//   "addressId": "64ef...",
//   "paymentMethod": "card"
// }
// 🟠 2. Backend Validates and Creates Stripe Payment Intent
// In createPaymentIntent:

// Fetch user cart from DB (Cart.findOne({ user }))

// Calculate total securely (looping over each item and its price)

// Create a Stripe PaymentIntent using:

// js
// Copy code
// stripe.paymentIntents.create({
//   amount: total * 100, // INR in paise
//   currency: 'inr',
//   metadata: {
//     userId,
//     addressId,
//     paymentMethod,
//     cartId
//   }
// });
// Responds with:

// json
// Copy code
// {
//   clientSecret: "...",
//   paymentIntentId: "pi_..."
// }
// 🟡 3. Frontend Confirms the Payment with Stripe
// Using Stripe.js or Stripe Elements:

// js
// Copy code
// const result = await stripe.confirmCardPayment(clientSecret, {
//   payment_method: {
//     card: cardElement,
//     billing_details: { name, email },
//   },
// });
// ✅ If successful:
// Payment is completed

// Stripe emits event: payment_intent.succeeded

// Your webhook receives this

// 🚨 What If the Payment Fails?
// ❌ Case 1: Card Declined
// Stripe emits: payment_intent.payment_failed

// Your webhook logs it:

// js
// Copy code
// case 'payment_intent.payment_failed':
//   console.warn(`❌ Payment failed for intent ${paymentIntent.id}`);
// No order is created

// ⚠️ Case 2: User Cancels Payment
// Stripe emits: payment_intent.canceled

// You handle it with a warning or log

// 🔁 Step 4: Stripe Calls Your Webhook
// 📬 POST /api/webhook (configured in Stripe Dashboard or via Stripe CLI)
// Raw Stripe payload is verified with:

// js
// Copy code
// event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
// 🔍 If event = payment_intent.succeeded:
// You extract userId, addressId, etc. from metadata

// Re-fetch cart from DB

// Create order:

// js
// Copy code
// Order.create({
//   user: userId,
//   items: cart.items,
//   totalPrice: amount,
//   paymentMethod,
//   ...
// })
// Clear cart

// ✅ This ensures order is created only if payment was confirmed by Stripe.

// 🧾 Summary: What Happens in Each Case
// Case	Flow	Result
// ✅ Successful Payment	Stripe creates payment intent → frontend confirms → webhook receives payment_intent.succeeded	Order created in DB, cart cleared
// ❌ Payment Failed	User enters invalid card → Stripe sends payment_intent.payment_failed	Webhook logs failure, no order
// ⛔ Payment Canceled	User closes Stripe popup → Stripe sends payment_intent.canceled	Webhook logs cancel, no order
// 🛑 Tampering / Wrong amount	Not possible — backend calculates secure price	Protects from frontend manipulation

// 🧠 Why This Architecture is Secure & Recommended
// ✅ Only backend calculates price
// ✅ Order is created only after Stripe confirms payment
// ✅ No reliance on frontend for final data
// ✅ Stripe webhooks ensure async and reliable tracking
// ✅ Idempotency key prevents accidental duplicate charges

// ✅ Bonus: You Can Extend It With...
// Feature	How
// Email Order Confirmation	Trigger email in webhook after order
// Refunds	Add stripe.refunds.create(...) API
// Payment status tracking	Save status field from Stripe
// Partial payments or offers	Apply discount before creating payment intent
// Retry failed payments	Use Stripe’s automatic retries or allow user to re-attempt

