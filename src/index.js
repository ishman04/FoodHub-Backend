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

const app = express();

app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
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

app.listen(ServerConfig.PORT, async () => {
    await connectdb();
    console.log(`Server running on port ${ServerConfig.PORT}`);
});
