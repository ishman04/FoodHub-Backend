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
const fs = require('fs/promises') 

const app = express();

app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/ping',isLoggedIn,(req,res)=>{
    console.log('pinged')
    res.json({
        message: "pong"
    })
})

app.post('/photo',uploader.single('incomingFile'),async (req,res)=>{
    const result = await cloudinary.uploader.upload(req.file.path)
    console.log("Result from cloudinary: ", result)
    fs.unlink(req.file.path)
    res.json({
        message: "photo uploaded"
    })
})
app.use('/users', userRouter);
app.use('/carts', cartRouter);
app.use('/auth',authRouter)
app.listen(ServerConfig.PORT, async () => {
    await connectdb();
    console.log(`Server running on port ${ServerConfig.PORT}`);
});
