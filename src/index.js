const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const cloudinary = require('./config/cloudinaryConfig')
const ServerConfig = require('./config/serverConfig');
const connectdb = require('./config/dbConfig');
const User = require('./schema/userSchema');
const userRouter = require('./routes/userRoute'); // Import without destructuring
const cartRouter = require('./routes/cartRoute'); // Import without destructuring
const authRouter = require('./routes/authRoute');
const { isLoggedIn } = require('./validation/authValidator');
const uploader = require('./middlewares/multerMiddleware');
const fs = require('fs/promises'); 
const productRouter = require('./routes/productRoute');
const orderRouter = require('./routes/orderRoutes');
const cors = require('cors');
const analyticsRouter = require('./routes/analyticsRoute');
const deliveryRouter = require('./routes/deliveryRoutes');
const paymentRouter = require('./routes/paymentRoutes');
const webhookRouter = require('./routes/webhookRoutes');



const app = express();
app.use(cors({
    origin: "https://food-hub-frontend-eight.vercel.app",
    credentials: true
}))  // to allow cross platform requests
app.use(
  '/webhook', // this is crucial
  webhookRouter
);
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.get('/ping',(req,res)=>{
    console.log('pinged')
    res.json({
        message: "pong"
    })
})

app.use('/users', userRouter);
app.use('/carts', cartRouter);
app.use('/auth',authRouter)
app.use('/product',productRouter)
app.use('/order',orderRouter);
app.use('/analytics',analyticsRouter)
app.use('/delivery',deliveryRouter)
app.use('/payment',paymentRouter)
// app.use('/webhook',webhookRouter)

app.listen(ServerConfig.PORT, async () => {
    await connectdb();
    console.log(`Server running on port ${ServerConfig.PORT}`);
});
