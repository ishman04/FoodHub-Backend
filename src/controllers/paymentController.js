const stripe = require("../config/stripe");
const Order = require("../schema/orderSchema");
const createPaymentIntent = async(req,res) => {
    try {
        const userId = req.user.id
        const {amount, cart, addressId, paymentMethod} = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'inr',
            payment_method_types: ['card'],
            metadata: {
                userId,
                cart: JSON.stringify(cart),
                addressId,
                paymentMethod,
                amount,
            }
        })
        res.status(200)
            .json({
                success: true,
                message: 'Payment intent created successfully',
                data:{
                    clientSecret: paymentIntent.client_secret
                }
            })
    } catch (error) {
        res.status(500)
        console.log(error)
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
    console.error('⚠️ Webhook error:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle payment success
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    
    try {
      // Extract metadata from payment intent
      const { userId, cart, addressId, paymentMethod } = paymentIntent.metadata;
      
      // Create order
      const order = await Order.create({
        user: userId,
        items: JSON.parse(cart),
        address: addressId,
        totalPrice: paymentIntent.amount / 100,
        paymentMethod,
        paymentIntentId: paymentIntent.id,
        isPaid: true,
        paidAt: new Date(),
        status: 'ordered'
      });

      console.log(`Order ${order._id} created for payment ${paymentIntent.id}`);
    } catch (err) {
      console.error('Order creation failed:', err);
    }
  }

  res.json({received: true});
};


module.exports ={
    createPaymentIntent,
    handleWebhook
}